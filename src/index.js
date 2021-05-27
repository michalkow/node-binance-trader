const tradeQueue = require('./tradeQueue')
const { socket, registerSocketEvents } = require('./nbtSocket');
const { updateOpenTrades } = require('./bva');
const { updateMinimums, updateAvailableBalances, updateMarginPairs } = require('./exchange');

async function run() {
  tradeQueue.startQueue();
  await updateMarginPairs();
  await updateMinimums();
  await updateOpenTrades();
  await updateAvailableBalances();
  registerSocketEvents(socket);
}

run()
