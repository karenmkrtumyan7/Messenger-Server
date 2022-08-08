const { Message, User } = require('../helpers/db');

async function getMessages(req) {
  const { conversationId } = req.params;
  const messages = await Message.find().select('text date').populate({
    path: 'conversation',
    match: { conversationId: conversationId }
  });
  console.log(messages);
}

// async function getMembers(req) {
//   const members = await User.aggregate({})
// }

module.exports = {
  getMessages,
}
