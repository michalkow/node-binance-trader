const colors = require("colors")

const log = {
  buyLong(signal) {
    console.log(
      colors.grey(
        "BUY_SIGNAL :: ENTER LONG TRADE ::",
        signal.stratname,
        signal.stratid,
        signal.pair
      )
    )
  },
  sellShort(signal) {
    console.log(
      colors.grey(
        "SELL_SIGNAL :: ENTER SHORT TRADE ::",
        signal.stratname,
        signal.stratid,
        signal.pair
      )
    )
  },
  buyCoverShort(signal) {
    console.log(
      colors.grey(
        "BUY_SIGNAL :: BUY TO COVER SHORT TRADE ::",
        signal.stratname,
        signal.stratid,
        signal.pair
      )
    )
  },
  sellPair(ledger, signal) {
    console.log(
      signal.pair,
      " ===> SELL",
      signal.price,
      Number(ledger.getUserPayload(signal).buy_amount)
    )
  },
  buyPair(ledger, signal) {
    console.log(
      signal.pair,
      " ===> BUY",
      signal.price,
      Number(ledger.getUserPayload(signal).buy_amount)
    )
  },
  buyQtyPair(qty, pair) {
    console.log("Market Buy ==> " + qty + " - " + pair)
  },
  buyError(error, signal, qty, isMarginPair) {
    isMarginPair ?
      console.log("ERROR 3355333", error.body)
      :
      console.log(
        "ERROR 7991117 marketBuy",
        signal.pair,
        Number(qty),
        error.body
      )
  },
  buyCoverError(error, signal, qty) {
    console.log(
      "ERROR 6 ",
      signal.pair,
      Number(qty),
      error.body
    )
  },
  buyAgain(signal) {
    console.log(
      "BUY AGAIN",
      JSON.stringify(signal),
      tradingData.trading_types[signal.pair + signal.stratid]
    )
  }
}

export default log;
