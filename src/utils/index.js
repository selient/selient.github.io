import { NotificationManager } from 'react-notifications';
import { coinTypes, sumCoinsToAmount } from '../constants';

const formatTime = (ms) => {
  const minutes = Math.floor((ms / 1000 / 60) % 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor((ms / 1000) % 60)
    .toString()
    .padStart(2, '0');
  const milliseconds = Math.floor((ms % 1000) / 16.67)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}:${milliseconds}`;
};

const handleNotification = (type, millisecond, title, ttl) => {
  const timeString = `${millisecond > 0 ? '+' : ''}${millisecond / 1000} s`;
  return () => {
    switch (type) {
      case 'info':
        NotificationManager.info(timeString, title, ttl);
        break;
      case 'success':
        NotificationManager.success(timeString, title, ttl);
        break;
      case 'warning':
        NotificationManager.warning(timeString, title, ttl);
        break;
      case 'error':
        NotificationManager.error(timeString, title, ttl);
        break;
      default:
        break;
    }
  };
};

const getChangeBreakdown = (total, paid) => {
  const change = paid - total;
  let remaining = change;
  const breakdown = {};

  for (let i = 0; i < coinTypes.length; i += 1) {
    const coin = coinTypes[i];
    const count = Math.floor(remaining / coin);

    if (count > 0) {
      breakdown[coin] = count;
      remaining -= count * coin;
    }
  }

  return breakdown;
};

const generateIntBetween = (min, max) => {
  const int = Math.floor(Math.random() * (max - min + 1)) + min;
  return int;
};

const countCoins = (coins) => Object.keys(coins).reduce((acc, key) => acc + coins[key], 0);

const generateNextPrice = (coins, combo) => {
  const amount = sumCoinsToAmount(coins);
  let price;
  let perfectPrice;
  // let hardPrice;

  const comboPrice = Math.min(200 + combo * 100, amount);

  const maxCoinCanBeUsed = coinTypes.find((coin) => comboPrice / coin > 0);

  const perfectCoins = Object.keys(coins).reduce((acc, cur) => {
    const key = Number(cur);
    if (key > maxCoinCanBeUsed) {
      acc[key] = 0;
      return acc;
    }
    // use less coins
    if (countCoins(coins) > 5) {
      return acc;
    }
    acc[key] = generateIntBetween(0, coins[key]);
    return acc;
  }, {});

  if (sumCoinsToAmount(perfectCoins) > 0) {
    perfectPrice = sumCoinsToAmount(perfectCoins);
  } else {
    perfectPrice = generateIntBetween(comboPrice - 100, comboPrice);
  }

  const scaledPrice = generateIntBetween(comboPrice - 100, comboPrice);

  // const emptyCoins = Object.keys(coins).filter((key) => coins[key] === 0);

  // if (emptyCoins.length > 0) {
  //   const hardCoins = emptyCoins.reduce((acc, cur) => {
  //     const key = Number(cur);
  //     acc[key] = generateIntBetween(0, 1);
  //     return acc;
  //   }, {});

  //   const fewCoins = Object.keys(coins).reduce((acc, cur) => {
  //     const key = Number(cur);
  //     acc[key] = generateIntBetween(0, 1);
  //     return acc;
  //   }, {});

  //   const totalCoins = {
  //     ...fewCoins,
  //     ...hardCoins,
  //   };
  //   if (countCoins(totalCoins) > 0) {
  //     hardPrice = sumCoinsToAmount(totalCoins);
  //   } else {
  //     hardPrice = generateIntBetween(comboPrice - 100, comboPrice);
  //   }
  // } else {
  //   hardPrice = generateIntBetween(comboPrice - 100, comboPrice);
  // }

  const probability = generateIntBetween(0, 100);
  if (probability <= 10) {
    price = perfectPrice;
    // } else if (probability < 80) {
  } else {
    price = scaledPrice;
  }
  // } else {
  //   price = hardPrice;
  // }
  // price = hardPrice;

  // if (price === 0) {
  //   price = generateIntBetween(100, 300);
  // }

  return price;
};

export {
  sumCoinsToAmount,
  formatTime,
  getChangeBreakdown,
  generateIntBetween,
  countCoins,
  handleNotification,
  generateNextPrice,
};
