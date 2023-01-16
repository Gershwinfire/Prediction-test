const axios = require('axios');

const API_KEY = 'cf2c4u2ad3idqn4q5ba0cf2c4u2ad3idqn4q5bag';
const INTERVAL = '30min';
const SYMBOL = 'BTCUSDT';

const calculateEMA = (data, period) => {
let k = 2 / (period + 1);
let ema = data[0];
for (let i = 1; i < data.length; i++) {
ema = data[i] * k + ema * (1 - k);
}
return ema;
}

const calculateRSI = (data, period) => {
let gains = 0;
let losses = 0;
for (let i = 1; i < data.length; i++) {
let change = data[i] - data[i - 1];
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

const calculateBollingerBands = (data, period) => {
const mean = data.reduce((a, b) => a + b) / data.length;
let sd = 0;
data.forEach(d => {
sd += Math.pow(d - mean, 2);
});
sd = Math.sqrt(sd / data.length);
const upperBand = mean + (2 * sd);
const lowerBand = mean - (2 * sd);
return {upperBand, lowerBand};
}

const predict = async () => {
try {
// Fetch historical data from the API
const response = await axios.get("https://finnhub.io/api/v1/crypto/candle?symbol=BINANCE:BTCUSDT&resolution=300&count=24&token=cf2c4u2ad3idqn4q5ba0cf2c4u2ad3idqn4q5bag");
// check if the response data is in the expected format
if (!response.data || !response.data.c) {
console.log("Unexpected data format received from the API")
return
}
const data = response.data;
// Calculate EMA, RSI, Bollinger Bands and other indicators
const ema = calculateEMA(data.c, 30);
const rsi = calculateRSI(data.c, 14);
const bollingerBands = calculateBollingerBands(data.c, 14);
// Add more conditions to make prediction
const slopeEma = (ema - data.c[data.c.length - 1])/30;
const slopeRsi = (rsi - calculateRSI(data.c, data.c.length - 1))/14;
// Make prediction based on the calculated values
if (rsi > 50 && slopeRsi > 0 && slopeEma > 0 && ema > data.c[data.c.length - 1]) {
console.log("Next 30min wick is likely to be red");
} else if (rsi < 40 && slopeRsi < 0 && slopeEma < 0 && ema < data.c[data.c.length - 1]) {
console.log("Next 30min wick is likely to be green");
} else {
console.log("Risk: Next 30min wick is uncertain");
}
} catch (error) {
console.log(error);
}
}
predict();