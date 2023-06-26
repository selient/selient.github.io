import React from 'react';
import styles from '../style/index.module.css';
import coin1 from '../../assets/images/yen/1.png';
import coin5 from '../../assets/images/yen/5.png';
import coin10 from '../../assets/images/yen/10.png';
import coin50 from '../../assets/images/yen/50.png';
import coin100 from '../../assets/images/yen/100.png';
import coin500 from '../../assets/images/yen/500.png';
import coin1000 from '../../assets/images/yen/1000.png';


function CoinImage({ coin, count, callback }) {

  let coinImage = null;
  const coinKey = Number(coin);
  switch (coinKey) {
    case 1:
      coinImage = coin1;
      break;
    case 5:
      coinImage = coin5;
      break;
    case 10:
      coinImage = coin10;
      break;
    case 50:
      coinImage = coin50;
      break;
    case 100:
      coinImage = coin100;
      break;
    case 500:
      coinImage = coin500;
      break;
    case 1000:
      coinImage = coin1000;
      break;
    default:
      break;
  }
  const imageUrls = Array.from({ length: count }, () => coinImage);
  return (
    <div className={styles.imageContainer} key={`con${coinKey}`}>
      {imageUrls.map((imageUrl, index) => {
        const shift = index * 4;
        const style = {
          top: `${shift}px`,
          left: `${shift}px`,
          zIndex: index + 1,
          position: 'absolute',
          margin: '0 auto',
          height: '4rem',
        };

        return (
          <img
            key={`coin_${coinKey}_${index}`}
            src={`.${imageUrl}`}
            alt={`coin ${coinKey} ${index + 1}`}
            style={style} // Pass the dynamically generated inline style
            onClick={() => callback(coinKey)}
          />
        );
      })}
    </div>
  );
}

export default CoinImage;
