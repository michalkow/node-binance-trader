const colors = require("colors")

export default class Logger {
  constructor(ledger, signal) {
    this.ledger = ledger;
    this.signal = signal;
  }

  buyLong = () => {
    console.log(
      colors.grey(
        "BUY_SIGNAL :: ENTER LONG TRADE ::",
        this.signal.stratname,
        this.signal.stratid,
        this.signal.pair
      )
    )
  }

  buyCoverShort = () =>  {
    console.log(
      colors.grey(
        "BUY_SIGNAL :: BUY TO COVER SHORT TRADE ::",
        this.signal.stratname,
        this.signal.stratid,
        this.signal.pair
      )
    )
  }

  buyPair = () => {
    console.log(
      this.signal.pair,
      " ===> BUY",
      this.signal.price,
      Number(this.ledger.getUserPayload(this.signal).buy_amount)
    )
  }

  buyQtyPair = (qty) => {
    console.log("Market Buy ==> " + qty + " - " + this.signal.pair)
  }

  buyError = (error, qty, isMarginPair) => {
    isMarginPair ?
      console.log("ERROR 3355333", error.body)
      :
      console.log(
        "ERROR 7991117 marketBuy",
        this.signal.pair,
        Number(qty),
        error.body
      )
  }

  buyCoverError = (error, qty) => {
    console.log(
      "ERROR 6 ",
      this.signal.pair,
      Number(qty),
      error.body
    )
  }

  buyAgain = () => {
    console.log(
      "BUY AGAIN",
      JSON.stringify(this.signal),
      tradingData.trading_types[this.signal.pair + this.signal.stratid]
    )
  }
}
