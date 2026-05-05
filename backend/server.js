require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
