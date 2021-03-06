import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import {
  formatTime,
  getChangeBreakdown,
  generateIntBetween,
  sumCoinsToAmount,
  countCoins,
  handleNotification,
  generateNextPrice,
} from '../utils';
import {
  initialPayment,
  initialGame,
  defaultCoins,
  paymentResultMap,
  initialWallet,
} from '../constants';
import CoinImage from './CoinImage';
import styles from '../style/index.module.css';
import 'react-notifications/lib/notifications.css';

function GamePlay() {
  const [wallet, setWallet] = useState(initialWallet);
  const [game, setGame] = useState(initialGame);
  const navigate = useNavigate();

  useEffect(() => {
    if (game.timeLeft <= 0) {
      NotificationManager.removeAll();
      navigate('/end', { state: { game } });
    }
  }, [game, navigate]);

  useEffect(() => {
    setGame((prevGame) => ({
      ...prevGame,
      price: generateIntBetween(100, 200),
    }));
    const timerId = setInterval(() => {
      setGame((prevGame) => ({
        ...prevGame,
        timeLeft: prevGame.timeLeft - 10,
      }));
    }, 10);

    return () => clearInterval(timerId);
  }, []);

  const handleCoinClick = (denomination) => {
    if (wallet.coins[denomination] <= 0) {
      return false;
    }
    setGame((prevGame) => ({
      ...prevGame,
      pendingPayment: {
        ...prevGame.pendingPayment,
        coins: {
          ...prevGame.pendingPayment.coins,
          [denomination]: prevGame.pendingPayment.coins[denomination] + 1,
        },
        amount: prevGame.pendingPayment.amount + Number(denomination),
      },
    }));

    setWallet((prevWallet) => ({
      ...prevWallet,
      coins: {
        ...prevWallet.coins,
        [denomination]: prevWallet.coins[denomination] - 1,
      },
      amount: prevWallet.amount - Number(denomination),
    }));
    return true;
  };

  const handlePaymentClick = (denomination) => {
    if (game.pendingPayment.coins[denomination] <= 0) {
      return false;
    }
    setGame((prevGame) => ({
      ...prevGame,
      pendingPayment: {
        ...prevGame.pendingPayment,
        coins: {
          ...prevGame.pendingPayment.coins,
          [denomination]: prevGame.pendingPayment.coins[denomination] - 1,
        },
        amount: prevGame.pendingPayment.amount - Number(denomination),
      },
    }));

    setWallet((prevWallet) => ({
      ...prevWallet,
      coins: {
        ...prevWallet.coins,
        [denomination]: prevWallet.coins[denomination] + 1,
      },
      amount: prevWallet.amount + Number(denomination),
    }));
    return true;
  };

  const topUpWallet = (coins, amount) => {
    const added = Math.floor((5000 - amount) / 1000);
    const nextCoins = {
      ...coins,
      1000: coins[1000] + added,
    };
    const nextAmount = sumCoinsToAmount(nextCoins);

    return { nextCoins, nextAmount };
  };

  const handlePaymentResult = (returnCoins) => {
    let isGreatPayment = true;

    const nextCoins = Object.keys(returnCoins).reduce((acc, key) => {
      const denomination = Number(key);
      if (wallet.coins[denomination] + returnCoins[denomination] > defaultCoins[denomination]) {
        isGreatPayment = false;
      }
      return {
        ...acc,
        [denomination]: wallet.coins[denomination] + returnCoins[denomination],
      };
    }, {});

    const isOverCoinPayment = countCoins(nextCoins) > game.walletSize;

    const isMissedPayment = !!Object.keys(returnCoins).find(
      (key) => game.pendingPayment.coins[key] > 0,
    );

    const isPerfectPayment = sumCoinsToAmount(returnCoins) === 0;

    let type = null;
    const ttl = 800;

    if (isMissedPayment) {
      type = 'missed';
      handleNotification('error', paymentResultMap[type].time, 'Missed!', ttl)();
    } else if (isOverCoinPayment) {
      type = 'excessive';
      handleNotification('error', paymentResultMap[type].time, 'Excessive!', ttl)();
    } else if (isPerfectPayment) {
      type = 'perfect';
      handleNotification('success', paymentResultMap[type].time, 'Perfect!', ttl)();
    } else if (isGreatPayment) {
      type = 'great';
      handleNotification('info', paymentResultMap[type].time, 'Great!', ttl)();
    } else if (!isGreatPayment) {
      type = 'good';
      handleNotification('warning', paymentResultMap[type].time, 'Good!', ttl)();
    }

    return paymentResultMap[type];
  };

  // const handleChange = (g) => {
  //   if (g.pendingPayment.amount < g.price) {
  //     return '';
  //   }
  //   return g.pendingPayment.amount - g.price;
  // };

  const handlePayment = () => {
    if (game.pendingPayment.amount < game.price) {
      return false;
    }

    const returnCoins = getChangeBreakdown(game.price, game.pendingPayment.amount);

    let nextCoins = Object.keys(wallet.coins).reduce((acc, cur) => {
      const denomination = Number(cur);
      return {
        ...acc,
        [denomination]: wallet.coins[denomination] + (returnCoins[denomination] || 0),
      };
    }, {});

    let nextAmount = sumCoinsToAmount(nextCoins);

    if (nextAmount < 5000) {
      ({ nextCoins, nextAmount } = topUpWallet(nextCoins, nextAmount));
    }

    setWallet((prevWallet) => ({
      ...prevWallet,
      coins: nextCoins,
      amount: nextAmount,
    }));

    const { score, time: timeAdjust, combo } = handlePaymentResult(returnCoins);
    const nextCombo = combo ? game.combo + combo : 0;

    const nextPrice = generateNextPrice(nextCoins, nextCombo, nextAmount);

    setGame((prevGame) => ({
      ...prevGame,
      price: nextPrice,
      pendingPayment: initialPayment,
      score: prevGame.score + score * generateIntBetween(95, 105),
      timeLeft: prevGame.timeLeft + timeAdjust,
      combo: nextCombo,
      maxCombo:
        prevGame.combo + combo > prevGame.maxCombo ? prevGame.combo + combo : prevGame.maxCombo,
      paymentMade: {
        time: timeAdjust,
        combo,
        score,
      },
    }));
    return true;
  };

  return (
    <div className={styles.main}>
      {/* <h1>Coin Game</h1> */}
      <div>
        <section className={styles.flexContainer}>
          <div>
            <h3>Time</h3>
            <span>{formatTime(game.timeLeft)}</span>
          </div>
          <div>
            <h3>Score</h3>
            <span>{game.score}</span>
          </div>
          <div>
            <h3>Combo</h3>
            <span>{game.combo}</span>
          </div>
          <div>
            <h3>Price</h3>
            <span>{game.price}</span>
          </div>
          <div>
            <h3>Amount</h3>
            <span>{game.pendingPayment.amount}</span>
          </div>
          {/* <div>
            {game.maxCombo}
          </div> */}
        </section>

        {/* <h2>Pending Payment</h2> */}
        <div className={styles.coinContainer}>
          {Object.keys(game.pendingPayment.coins).map((key) => (
            <CoinImage
              coin={key}
              count={game.pendingPayment.coins[key]}
              key={key}
              callback={handlePaymentClick}
            />
          ))}
        </div>

        <button type="button" className={styles.payButton} onClick={handlePayment}>
          Pay!
        </button>

        {/* <h2>Wallet</h2> */}
        <div className={styles.coinContainer}>
          {Object.keys(wallet.coins).map((key) => (
            <CoinImage coin={key} count={wallet.coins[key]} key={key} callback={handleCoinClick} />
          ))}
        </div>
        <NotificationContainer />
      </div>
    </div>
  );
}

export default GamePlay;
