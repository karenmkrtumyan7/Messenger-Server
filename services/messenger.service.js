const { Message, User, Conversation } = require('../helpers/db');
const _ = require('lodash');

async function getMessages(req) {
  const { conversationId } = req.params;

  const messages = await Message.find().select('text date').populate({
    path: 'conversation',
  });

  const response = messages.map(message => {
    const info = _.pick(message, ['text', 'date', '_id']);
    const conversationInfo = _.pick(message.conversation, ['from', 'to', 'conversationId']);
    return _.merge(info, conversationInfo);
  });

  return response;
}

async function getMembers(req, res) {
  const { id } = req.params;
  const users = await User.find({_id: {$ne: id}}).select('_id userName');
  const usersIds = users.map(user => user._id.toString());
  const conversations = await Conversation.find({ from: id, to: { $in: usersIds } });

  if (_.isEmpty(conversations)) {
    return users;
  }

  const response = users.map((user, i) => {
    return {
      _id: user._id,
      userName: user.userName,
      avatar: user.avatar,
      conversationId: conversations[i].conversationId,
    }
  });

  return response;
}

module.exports = {
  getMessages,
  getMembers,
}
