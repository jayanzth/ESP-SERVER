const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// MongoDB connection using environment variable
const mongoURI = process.env.MONGO_URI || 'your_local_mongo_uri';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

const app = express();
app.use(bodyParser.json());

// MongoDB Schema and Model
const DataSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  timestamp: { type: Date, default: Date.now }
});

const SensorData = mongoose.model('SensorData', DataSchema);

// Endpoint to receive data from ESP32
app.post('/data', async (req, res) => {
  try {
    const { temperature, humidity } = req.body;
    const data = new SensorData({ temperature, humidity });
    await data.save();

    res.json({ message: 'Data received', data });
  } catch (err) {
    res.status(500).json({ message: 'Error saving data', error: err.message });
  }
});

// Dynamic Port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});