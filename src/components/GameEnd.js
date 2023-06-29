import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { initialGame } from '../constants';
import styles from '../style/index.module.css';

function GameEnd() {
  const navigate = useNavigate();
  const location = useLocation();

  const game = location.state ? location.state.game : initialGame;
  const { score, maxCombo } = game;

  const handleStartClick = () => {
    navigate('/');
  };

  return (
    <div className={styles.main}>
      <h1>GG!</h1>
      <p>Score: {score}</p>
      <p>Max Combo: {maxCombo}</p>

      <button type="button" className={styles.pageButton} onClick={handleStartClick}>
        Play Again
      </button>
    </div>
  );
}

export default GameEnd;
