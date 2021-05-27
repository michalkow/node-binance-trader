const axios = require('axios')
const ledger = require('./ledger');
const binance = require('./binance');

const updateMinimums = async () => {
  const { symbols } = await binance.futuresExchangeInfo().catch(error => console.log(error));
  symbols.forEach(symbol => {
    if (symbol.contractType !== 'PERPETUAL')
      return false;

    symbol.filters.forEach(filter => {
      let minimums = {};
      if (filter.filterType == 'MIN_NOTIONAL') {
        minimums.minNotional = filter.minNotional
      } else if (filter.filterType == 'PRICE_FILTER') {
        minimums.minPrice = filter.minPrice
        minimums.maxPrice = filter.maxPrice
        minimums.tickSize = filter.tickSize
      } else if (filter.filterType == 'LOT_SIZE') {
        minimums.stepSize = filter.stepSize
        minimums.minQty = filter.minQty
        minimums.maxQty = filter.maxQty
      }
      minimums.orderTypes = symbol.orderTypes
      minimums.icebergAllowed = symbol.icebergAllowed
      ledger.setMinimums(symbol.symbol, minimums);
    })
  });
  console.log('Exchange minimums:', Object.keys(ledger.getMinimums()))
  return true;
}

const updateAvailableBalances = async () => {
  const balances = await binance.balance().catch(error => console.error('LOADING BINANCE SPOT BALANCE', error))
  ledger.updateAvailableBalances(balances);
  console.log('DONE', ledger.getAvailableBalances())
  return true;
}

const updateMarginPairs = async () => {
  const result = await axios
    .get('https://www.binance.com/gateway-api/v1/friendly/margin/symbols')
    .catch((e) => console.log('ERROR UpdateMarginPairs', e.response.data))
  let list = result.data.data.map((obj) => obj.symbol).sort();
  ledger.setMarginPairs(list);
  console.log('Margin Pairs:', list)
  return list;
}

module.exports = {
  updateMinimums,
  updateAvailableBalances,
  updateMarginPairs
}
