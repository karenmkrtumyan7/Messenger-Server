const { Schema, model } = require('mongoose');

const Message = new Schema({
  text: { type: String, required: true },
  date: { type: Date, default: new Date(), required: true },
  seen: { type: Boolean, default: false, required: true },
  visible: { type: Boolean, default: false, required: true },
  conversation: { type: Object, ref: 'Conversation' },
});

module.exports = model('Message', Message);
