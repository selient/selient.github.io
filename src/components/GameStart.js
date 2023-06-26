import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../style/index.module.css';

function GameStart() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/play');
  };

  return (
    <div className={styles.main}>
      <h1>Coin Game</h1>
      <button type="button" className={styles.pageButton} onClick={handleStartClick}>Start</button>
    </div>
  );
}

export default GameStart;
