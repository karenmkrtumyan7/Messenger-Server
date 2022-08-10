const { Schema, model, Types } = require('mongoose');

const Conversation = new Schema({
    from: { type: Object, ref: 'Users' },
    to: { type: Object, ref: 'Users' },
    conversationId: { type: Schema.Types.ObjectId, default: Types.ObjectId },
});

module.exports = model('Conversation', Conversation);
