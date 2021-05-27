const { values } = require('lodash')
const axios = require('axios')
const ledger = require('./ledger');
const env = require('./env');

const updateOpenTrades = async () => {
  const { data } = await axios
    .get(`https://bitcoinvsaltcoins.com/api/useropentradedsignals?key=${env.BVA_API_KEY}`)
    .catch((e) => console.log('ERROR UpdateOpenTrades', e.response.data));
  ledger.updateOpenTradeSignals(data.rows);
  console.log('Open Trades #:', values(ledger.getTraidingPairs()).length)
  console.log('Open Trades:', ledger.getTraidingPairs())
  return true;
};

module.exports = {
  updateOpenTrades
}
