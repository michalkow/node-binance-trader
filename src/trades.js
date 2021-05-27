const ledger = require('./ledger');
const log = require('./log');
const env = require('./env');
const binance = require('./binance');
const { TradeTypeEnum } = require('./constants');
const { socket } = require('./nbtSocket');
const tradeQueue = require('./tradeQueue')

const getTradeTypeName = (type, isMarginPair, isFuture) =>
  isFuture ? isMarginPair ? type : type.replace('mgMarket', 'market') : type.replace('mgMarket', 'futuresMarket');

const getTradeSignal = (ledger, signal, qty = null) => ({
  key: env.BVA_API_KEY,
  stratname: signal.stratname,
  stratid: signal.stratid,
  trading_type: ledger.getTradingType(signal),
  pair: signal.pair,
  qty
})

const marketTrade = (type, qty, signal, isFuture) => {
  const { borrow, repay, tradeName, tradeSignalType, registerTradeType, logError, logSuccess, logStart } = TradeTypeEnum[type];
  const { baseAsset, isMarginTradingAllowed } = ledger.findSymbol(signal.pair, isFuture);
  const { trading_type } = ledger.getUserPayload(signal);
  const quantity = Number(qty);
  const tradeSignal = getTradeSignal(ledger, signal, qty);
  const tradeTypeName = getTradeTypeName(tradeName, isMarginTradingAllowed, isFuture);

  const trade = async () => {
    log[logStart](signal);

    if (trading_type === 'real') {
      if (borrow) {
        log.borrow(baseAsset, qty);
        await binance.mgBorrow(baseAsset, quantity).catch(error => {
          log.borrowError(error, baseAsset, qty);
          throw error;
        });
      }

      await binance[tradeTypeName](signal.pair, quantity).catch(error => {
        log[logError](error, signal, qty, isMarginTradingAllowed);
        throw error;
      });

      if (repay) {
        log.repay(baseAsset, qty);
        await binance.mgRepay(baseAsset, quantity).catch(error => {
          log.repayError(error, baseAsset, qty);
          throw error;
        })
      }
    }

    log[logSuccess](signal, qty, isMarginTradingAllowed);
    ledger[registerTradeType](ledger, signal, qty);
    socket.emit(tradeSignalType, tradeSignal);
    return true;
  }

  tradeQueue.addToQueue(trade)
}

module.exports = {
  marketTrade
}
