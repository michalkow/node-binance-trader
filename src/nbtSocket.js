const io = require('socket.io-client');
const env = require('./env');
const log = require('./log');
const ledger = require('./ledger');
const { handleTradeSignal } = require('./signals');

const nbt_vers = env.BVA_VERSION
const bva_key = env.BVA_API_KEY

const socket = io('https://nbt-hub.herokuapp.com', {
  query: 'v=' + nbt_vers + '&type=client&key=' + bva_key,
})

const registerSocketEvents = socket => {
  socket.on('connect', () => log.socketConnect());

  socket.on('disconnect', () => log.socketDisconnect());

  socket.on('message', (message) => log.socketMessage(message));

  socket.on('buy_signal', (signal) => handleTradeSignal('buy_signal', signal));

  socket.on('sell_signal', (signal) => handleTradeSignal('sell_signal', signal));

  socket.on('close_traded_signal', (signal) => handleTradeSignal('close_traded_signal', signal));

  socket.on('stop_traded_signal', (signal) => handleTradeSignal('stop_traded_signal', signal));

  socket.on('user_payload', (data) => {
    log.socketUpdate();
    ledger.setUserPayload(data);
  })
}

module.exports = {
  socket,
  registerSocketEvents
}
