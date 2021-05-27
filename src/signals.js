const ledger = require('./ledger');
const log = require('./log');
const binance = require('./binance');
const env = require('./env');
const { marketTrade } = require('./trades');
const tradeShortEnabled = env.TRADE_SHORT_ENABLED

const handleBuySignal = (signal) => {
  const stepSize = ledger.getPairStepSize(signal.pair);
  log.buyPair(ledger, signal);
  if (!ledger.getTraidingPair(signal) && signal.new) {
    let qty = binance.roundStep(ledger.getStratSignalQuantity(signal), stepSize);
    log.buyLong(signal);
    log.buyQtyPair(qty, signal.pair);
    marketTrade('BUY', qty, signal);
  } else if (tradeShortEnabled && ledger.getTradingTypes(signal) === 'SHORT' && ledger.getTradingQty(signal) && !signal.new && ledger.getOpenTrades(signal)) {
    let qty = Number(ledger.getTradingQty(signal));
    log.buyCoverShort(signal);
    log.buyQtyPair(qty, signal.pair);
    marketTrade('COVER_BUY', qty, signal);
  } else {
    log.buyAgain(signal);
  }
}

const handleSellSignal = (signal) => {
  const stepSize = ledger.getPairStepSize(signal.pair);
  log.sellPair(ledger, signal);
  if (tradeShortEnabled && !ledger.getTraidingPair(signal) && signal.new) {
    log.sellShort(signal);
    let qty = binance.roundStep(ledger.getStratSignalQuantity(signal), stepSize);
    marketTrade('SELL', qty, signal);
  } else if (
    ledger.getTradingTypes(signal) === 'LONG' &&
    ledger.getTradingQty(signal) &&
    !signal.new &&
    ledger.getOpenTrades(signal)
  ) {
    const qty = ledger.getTradingQty(signal);
    log.sellExitLong(signal)
    marketTrade('EXIT_SELL', qty, signal);
  } else {
    log.sellAgain(ledger, signal)
  }
}

const handleCloseSignal = (signal) => {
  log.closeTrade(ledger, signal);
  if (ledger.getTradingTypes(signal) === 'LONG') {
    const { qty } = signal;
    log.sellQtyPair(qty, signal.pair);
    log.sellExitLong(signal)
    marketTrade('EXIT_SELL', qty, signal);
  } else {
    let qty = Number(ledger.getTradingQty(signal));
    log.buyQtyPair(qty, signal.pair);
    log.buyCoverShort(signal);
    marketTrade('COVER_BUY', qty, signal);
  }
}

const handleStopSignal = (signal) => {
  log.stopTrade(ledger, signal);
  ledger.removeTrade(signal)
}

const handleTradeSignal = (type, signal) => {
  const symbol = ledger.findSymbol(signal.pair);
  const tresult = ledger.getUserPayloadIndex(signal);
  if (!tresult > -1)
    return false;

  if (!symbol)
    return console.log('PAIR UNKNOWN')

  if (type === 'buy_signal')
    return handleBuySignal(signal, symbol)
  if (type === 'sell_signal')
    return handleSellSignal(signal, symbol)
  if (type === 'close_traded_signal')
    return handleCloseSignal(signal, symbol)
  if (type === 'stop_trade_signal')
    return handleStopSignal(signal)
}

module.exports = {
  handleTradeSignal
}
