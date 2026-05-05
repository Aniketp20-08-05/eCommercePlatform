const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderId: { type: String, required: true, unique: true },
  items: [
    {
      id: { type: Number, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String }
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, default: 'Processing' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
