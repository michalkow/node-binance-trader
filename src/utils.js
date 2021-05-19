import env from './env';

export const getAltCoin = signal => signal.pair.replace('BTC', '');

export const getPair = signal => signal.pair;

export const getTradeSignal = (ledger, signal, qty = null) => ({
  key: env.BVA_API_KEY,
  stratname: signal.stratname,
  stratid: signal.stratid,
  trading_type: ledger.getTradingType(signal),
  pair: signal.pair,
  qty
})
