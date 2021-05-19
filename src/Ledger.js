import { get, findIndex } from 'lodash';
import BigNumber from 'bignumber.js';

export default class Ledger {
  constructor(tradingData = {}) {
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
      margin_pairs: [],
    }, tradingData)
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

  getTradingTypes = signal =>
    get(this.tradingData.trading_types, `${signal.pair}${signal.stratid}`);

  getTradingQty = signal =>
    get(this.tradingData.trading_qty, `${signal.pair}${signal.stratid}`);

  getOpenTrades = signal =>
    get(this.tradingData.open_trades, `${signal.pair}${signal.stratid}`);
}
