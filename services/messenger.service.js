const { Message, User, Conversation } = require('../helpers/db');
const _ = require('lodash');
const { Types } = require('mongoose');

async function getMessages(req) {
  const { conversationId } = req.params;
  // console.log(conversationId);
  const messages = await Message.find().select('text date').populate({
    path: 'conversation',
    match: { conversationId: Types.ObjectId(conversationId) }
  });

  const response = messages.map(message => {
    const info = _.pick(message, ['text', 'date', '_id']);
    const conversationInfo = _.pick(message.conversation, ['from', 'to', 'conversationId']);
    return _.merge(info, conversationInfo);
  }).filter(message => message.conversationId);

  return response;
}

async function getMembers(req) {
  const { id } = req.params;
  const users = await User.find({_id: {$ne: Types.ObjectId(id)}}).select('_id userName');
  let conversations = await Conversation.find({ from: Types.ObjectId(id) });
  const usersWithoutConversationId = users.filter((user, i) => {
    return !conversations[i]?.conversationId;
  }).map(user => user._id);

  if (!_.isEmpty(usersWithoutConversationId)) {
    for (let i = 0; i < usersWithoutConversationId.length; i++) {
      const { userId } = req;
      const from = Types.ObjectId(userId);
      const to = usersWithoutConversationId[i];
      const conversationFromTo = new Conversation({ from, to });
      const conversationToFrom = new Conversation({ from: to, to: from, conversationId: conversationFromTo.conversationId });
      await conversationFromTo.save();
      await conversationToFrom.save();
    }

    conversations = await Conversation.find({ from: Types.ObjectId(id) });
  }

  const response = users.map((user, i) => {
    return {
      _id: user._id,
      userName: user.userName,
      avatar: user.avatar,
      conversationId: conversations[i]?.conversationId,
    }
  });
  return response;
}

module.exports = {
  getMessages,
  getMembers,
}
