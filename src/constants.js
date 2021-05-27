const TradeTypeEnum = {
  BUY: {
    repay: false,
    borrow: false,
    tradeName: 'mgMarketBuy',
    tradeSignalType: 'traded_buy_signal',
    registerTradeType: 'registerLongTrade',
    logStart: 'buyStart',
    logError: 'buyError',
    logSuccess: 'buySuccess'
  },
  COVER_BUY: {
    repay: true,
    borrow: false,
    tradeName: 'mgMarketBuy',
    tradeSignalType: 'traded_buy_signal',
    registerTradeType: 'removeTrade',
    logStart: 'buyStart',
    logError: 'buyError',
    logSuccess: 'buySuccess'
  },
  SELL: {
    repay: false,
    borrow: true,
    tradeName: 'mgMarketSell',
    tradeSignalType: 'traded_sell_signal',
    registerTradeType: 'registerShortTrade',
    logStart: 'buyStart',
    logError: 'buyError',
    logSuccess: 'buySuccess'
  },
  EXIT_SELL: {
    repay: false,
    borrow: false,
    tradeName: 'mgMarketSell',
    tradeSignalType: 'traded_sell_signal',
    registerTradeType: 'removeTrade',
    logStart: 'buyStart',
    logError: 'buyError',
    logSuccess: 'buySuccess'
  }
};

module.exports = {
  TradeTypeEnum
}
