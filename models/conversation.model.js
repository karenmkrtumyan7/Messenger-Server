const { Schema, model } = require('mongoose');

const Conversation = new Schema({
  messages: {
    from: { type: Object, ref: 'Users' },
    to: { type: Object, ref: 'Users' },
    conversationId: { type: Schema.Types.ObjectId, default: '_id' },
  }
});

module.exports = model('Conversation', Conversation);
