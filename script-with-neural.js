const tf = require('@tensorflow/tfjs');

const data = {
  c:  [
    20894.86,
    20818.74,
    
    ], // closing prices
  h: [
    21033.64,
    20914.81,
    20910,
    
    ], // high prices
  l: [
    20878.33,
    20777.37,
    20801,
    
    ], // low prices
  o: [
    20938.28,
    20895.43,
    20819.64,
    
    ], // opening prices
  t: [
    1673670600,
    1673672400,
    1673674200,
    
    ], // timestamp
  v: [
    7647.99717,
    6383.27739,
    5509.56515,
    
    ], // volume
}

// Preprocess the data to calculate indicators
const calculateEMA = (data, period) => {
  let k = 2 / (period + 1);
  let ema = data[0];
  for (let i = 1; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
  }
  return ema;
}
const calculateRSI = (data, period) => {
  // ...
}
const calculateBollingerBands = (data, period) => {
  // ...
}
const indicators = {
  ema: calculateEMA(data.c, 30),
  rsi: calculateRSI(data.c, 14),
  bollingerBands: calculateBollingerBands(data.c, 14),
}

// Prepare input and output data for training
const inputData = Object.values(indicators);
const outputData = data.c.map((c, i) => {
  return c > data.o[i] ? 1 : 0; // 1 for red, 0 for green
});

// Create the model
const model = tf.sequential();
model.add(tf.layers.dense({ units: 4, inputShape: [inputData[0].length], activation: 'relu' }));
model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

// Train the model
const xs = tf.tensor2d(inputData);
const ys = tf.tensor2d(outputData);
await model.fit(xs, ys, { epochs: 100 });

// Test the model
const testData = [indicators.ema, indicators.rsi, indicators.bollingerBands];
const result = model.predict(tf.tensor2d([testData]));
console.log(result.data);

if(result.data[0] > 0.5){
console.log("Prediction: The closing price will be higher than the opening price")
}else {
console.log("Prediction: The closing price will be lower than the opening price")
}



predict();