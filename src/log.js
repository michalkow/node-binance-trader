const colors = require('colors')

const log = {
  buyLong(signal) {
    console.log(
      colors.grey(
        'BUY_SIGNAL :: ENTER LONG TRADE ::',
        signal.stratname,
        signal.stratid,
        signal.pair
      )
    )
  },
  sellShort(signal) {
    console.log(
      colors.grey(
        'SELL_SIGNAL :: ENTER SHORT TRADE ::',
        signal.stratname,
        signal.stratid,
        signal.pair
      )
    )
  },
  sellExitLong(signal) {
    console.log(
      colors.grey(
        'SELL_SIGNAL :: SELL TO EXIT LONG TRADE ::',
        signal.stratname,
        signal.stratid,
        signal.pair
      )
    )
  },
  buyCoverShort(signal) {
    console.log(
      colors.grey(
        'BUY_SIGNAL :: BUY TO COVER SHORT TRADE ::',
        signal.stratname,
        signal.stratid,
        signal.pair
      )
    )
  },
  sellPair(ledger, signal) {
    console.log(
      signal.pair,
      ' ===> SELL',
      signal.price,
      Number(ledger.getUserPayload(signal).buy_amount)
    )
  },
  buyPair(ledger, signal) {
    console.log(
      signal.pair,
      ' ===> BUY',
      signal.price,
      Number(ledger.getUserPayload(signal).buy_amount)
    )
  },
  buyQtyPair(qty, pair) {
    console.log('Market Buy ==> ' + qty + ' - ' + pair)
  },
  sellQtyPair(qty, pair, isMarginPair) {
    console.log('QTY =======' + (isMarginPair ? 'mgM' : 'm') + 'arketSell======> ' + qty + ' - ' + pair)
  },
  borrowError(error, alt, qty) {
    console.log(
      'ERROR 55555555555',
      alt,
      Number(qty),
      JSON.stringify(error)
    )
  },
  buyError(error, signal, qty, isMarginPair) {
    isMarginPair ?
      console.log('ERROR 3355333', error.body)
      :
      console.log(
        'ERROR 7991117 marketBuy',
        signal.pair,
        Number(qty),
        error.body
      )
  },
  sellError(error) {
    console.log(
      'ERROR 333333333',
      JSON.stringify(error)
    )
  },
  sellExitError(error, signal, qty, isMarginPair) {
    isMarginPair ?
      console.log('ERROR 722211117', signal.pair, Number(qty), JSON.stringify(error))
      :
      console.log(
        'ERROR 7213331117 marketSell',
        signal.pair,
        Number(qty),
        JSON.stringify(error)
      )
  },
  buyCoverError(error, signal, qty) {
    console.log(
      'ERROR 6 ',
      signal.pair,
      Number(qty),
      error.body
    )
  },
  buyAgain(ledger, signal) {
    console.log(
      'BUY AGAIN',
      JSON.stringify(signal),
      ledger.getTradingTypes(signal)
    )
  },
  sellAgain(ledger, signal) {
    console.log(
      'SELL AGAIN',
      signal.stratname,
      signal.pair,
      !signal.new,
      ledger.getOpenTrades(signal),
      ledger.getTradingTypes(signal)
    )
  }
}

export default log;
