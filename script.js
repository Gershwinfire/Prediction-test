const axios = require('axios');

const API_KEY = 'cf2c4u2ad3idqn4q5ba0cf2c4u2ad3idqn4q5bag';
const INTERVAL = '30min';
const SYMBOL = 'BTCUSDT';

const calculateEMA = (data, period) => {
    let k = 2 / (period + 1);
    let ema = data.c[0];
    for (let i = 1; i < data.c.length; i++) {
        ema = data.c[i] * k + ema * (1 - k);
    }
    return ema;
}

const calculateRSI = (data, period) => {
    let gains = 0;
    let losses = 0;
    for (let i = 1; i < data.c.length; i++) {
        let change = data.c[i] - data.c[i - 1];
        if (change > 0) {
            gains += change;
        } else {
            losses -= change;
        }
    }
    let avgGain = gains / period;
    let avgLoss = losses / period;
    return 100 - (100 / (1 + (avgGain / avgLoss)));
}

const predict = async () => {
  try {
      // Fetch historical data from the API
      const response = await axios.get(`https://finnhub.io/api/v1//crypto/candle?symbol=BINANCE:BTCUSDT&resolution=D&count=100&token=cf2c4u2ad3idqn4q5ba0cf2c4u2ad3idqn4q5bag`);
      const data = response.data;
      
      
      // Calculate EMA, RSI and volume
      const ema = calculateEMA(data, 30);
      const rsi = calculateRSI(data, 14);
      const volume = data.v.reduce((acc, val) => acc + val, 0);
      console.log(rsi, volume, ema)
      // Make prediction based on the calculated values
      if (rsi > 70 && ema > data.c[data.length - 1] && volume > 2000000) {
          console.log("Next 30min wick is likely to be red");
      } else if (rsi < 30 && ema < data.c[data.length - 1] && volume < 2000000) {
          console.log("Next 30min wick is likely to be green");
      } else {
          console.log("Unable to predict next 30min wick");
      }
  } catch (error) {
      console.log(error);
  }
}

predict();
