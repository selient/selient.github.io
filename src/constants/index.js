import { sumCoinsToAmount } from '../utils';

// TODO: toggle max coin type
const coinTypes = [1000, 500, 100, 50, 10, 5, 1];

const initialPayment = {
  coins: {
    1: 0,
    5: 0,
    10: 0,
    50: 0,
    100: 0,
    500: 0,
    1000: 0,
  },
  amount: 0,
};

const initialGame = {
  price: 0,
  timeLeft: 60 * 1000, // 60 seconds
  pendingPayment: initialPayment,
  paymentMade: {
    time: null,
    score: null,
    combo: null
  },
  score: 0,
  combo: 0,
  maxCombo: 0,
  walletSize: 20,
};

const defaultCoins = {
  1: 4,
  5: 1,
  10: 4,
  50: 1,
  100: 4,
  500: 1,
  1000: 4,
};

const paymentResultMap = {
  excessive: {
    score: -1,
    time: -10 * 1000,
    combo: null // set to null to reset combo
  },
  missed: {
    score: -1,
    time: -15 * 1000,
    combo: null // set to null to reset combo
  },
  good: {
    score: 1,
    time: 1 * 1000,
    combo: 1
  },
  great: {
    score: 2,
    time: 2 * 1000,
    combo: 1
  },
  perfect: {
    score: 3,
    time: 15 * 1000,
    combo: 1
  },
};

const initialWallet = {
  coins: defaultCoins,
  amount: sumCoinsToAmount(defaultCoins),
};

export {
  coinTypes,
  initialPayment,
  initialGame,
  defaultCoins,
  paymentResultMap,
  initialWallet,
};
