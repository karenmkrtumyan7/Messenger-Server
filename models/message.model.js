const { Schema, model } = require('mongoose');

const Message = new Schema({
  messages: {
    text: { type: String, default: true, required: true },
    date: { type: Date, default: new Date() },
    conversation: { type: Object, ref: 'Conversation' },
  }
});

module.exports = model('Message', Message);
