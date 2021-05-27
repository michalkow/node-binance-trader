import { get, findIndex, filter } from 'lodash';
import BigNumber from 'bignumber.js';

class Ledger {
  constructor(tradingData = {}) {
    this.symbols = [];
    this.futureSymbols = [];
    this.tradingData = Object.assign({
      trading_pairs: {},
      open_trades: {},
      trading_types: {},
      trading_qty: {},
      buy_prices: {},
      sell_prices: {},
      user_payload: [],
      available_balances: [],
      minimums: {},
      margin_pairs: []
    }, tradingData)
  }

  getSymbols = (isFuture) =>
    isFuture ? this.futureSymbols : this.symbols;

  findSymbol = (pair, isFuture) =>
    this.getSymbols(isFuture).find(symbol => symbol.symbol === pair || symbol.pair === pair);

  setUserPayload = data => {
    this.user_payload = data;
  }

  setSymbols = (symbols, isFuture) => {
    this[isFuture ? 'futureSymbols' : 'symbols'] = filter(symbols, { contractType: 'PERPETUAL' });
  }

  getPairStepSize = (pair, isFuture) =>
    get(get(this.findSymbol(pair, isFuture), 'filters', []).find(({ filterType: 'LOT_SIZE' })), 'stepSize');


  setFutureMinimums = (symbol, data) => {
    this.futureMinimums[symbol] = data;
  }

  setMarginPairs = data => {
    this.margin_pairs = data;
  }

  setMinimums = (symbol, data) => {
    this.minimums[symbol] = data;
  }

  updateOpenTradeSignals = signals => {
    signals.forEach(({ pair, stratid, stopped, type, qty, buy_price, sell_price }) => {
      this.tradingData.trading_pairs[pair + stratid] = true
      this.tradingData.open_trades[pair + stratid] = !stopped
      this.tradingData.trading_types[pair + stratid] = type
      this.tradingData.trading_qty[pair + stratid] = qty
      this.tradingData.buy_prices[pair + stratid] = new BigNumber(buy_price)
      this.tradingData.sell_prices[pair + stratid] = new BigNumber(
        sell_price
      )
    })
  }

  updateAvailableBalances = balances => {
    for (let asset in balances) {
      if (balances[asset].available > 0.0) {
        this.tradingData.available_balances.push({
          asset: asset,
          available: balances[asset].available,
          onOrder: balances[asset].onOrder,
        })
      }
    }
  }

  registerShortTrade = (signal, qty) => {
    this.tradingData.trading_pairs[signal.pair + signal.stratid] = true;
    this.tradingData.trading_types[signal.pair + signal.stratid] = 'SHORT';
    this.tradingData.open_trades[signal.pair + signal.stratid] = true;
    this.tradingData.trading_qty[signal.pair + signal.stratid] = Number(qty);
  }

  registerLongTrade = (signal, qty) => {
    this.tradingData.trading_pairs[signal.pair + signal.stratid] = true;
    this.tradingData.trading_types[signal.pair + signal.stratid] = 'LONG';
    this.tradingData.open_trades[signal.pair + signal.stratid] = true;
    this.tradingData.trading_qty[signal.pair + signal.stratid] = Number(qty);
  }

  removeTrade = (signal) => {
    delete this.tradingData.trading_pairs[signal.pair + signal.stratid];
    delete this.tradingData.trading_types[signal.pair + signal.stratid];
    delete this.tradingData.buy_prices[signal.pair + signal.stratid];
    delete this.tradingData.sell_prices[signal.pair + signal.stratid];
    delete this.tradingData.trading_qty[signal.pair + signal.stratid];
    delete this.tradingData.open_trades[signal.pair + signal.stratid];
  }

  getMinimums = (pair) =>
    get(this.tradingData.minimums, pair, {});

  getMarginPair = (pair) =>
    this.tradingData.margin_pairs.includes(pair);

  getUserPayload = signal =>
    get(this.tradingData.user_payload, `[${this.getUserPayloadIndex(signal)}]`, {});

  getTradingPair = signal =>
    get(this.tradingData.trading_pairs, `${signal.pair}${signal.stratid}`);

  getUserPayloadIndex = ({ stratid }) =>
    findIndex(this.tradingData.user_payload, { stratid })

  getStratSignalQuantity = signal => {
    let { buy_amount } = this.getUserPayload(signal);
    let amount = new BigNumber(buy_amount)
    return amount.dividedBy(signal.price)
  }

  getTradingType = signal => {
    let { trading_type } = this.getUserPayload(signal);
    return trading_type;
  }

  getTradingPairs = () =>
    get(this.tradingData, 'trading_pairs');

  getAvailableBalances = () =>
    get(this.tradingData, 'available_balances');

  getTradingTypes = signal =>
    get(this.tradingData.trading_types, `${signal.pair}${signal.stratid}`);

  getTradingQty = signal =>
    get(this.tradingData.trading_qty, `${signal.pair}${signal.stratid}`);

  getOpenTrades = signal =>
    get(this.tradingData.open_trades, `${signal.pair}${signal.stratid}`);
}

const ledger = new Ledger();

module.exports = ledger;
