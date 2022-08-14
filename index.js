const express = require('express');
const cors = require('cors');
const bodyParser   = require('body-parser');
const corsOptions = require('./helpers/corsOptions');
const errorHandler = require('./helpers/errorHandler');
const authControllers = require('./controllers/auth.controllers');
const userControllers = require('./controllers/user.controllers');
const messengerControllers = require('./controllers/messenger.controller')
const dotenv = require('dotenv').config;
const http = require('http');
const useSocket = require("socket.io");
const { Conversation, Message } = require('./helpers/db');
const _ = require('lodash');
const { Types } = require('mongoose');
const app = express();
dotenv();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/auth', authControllers);
app.use('/users', userControllers);
app.use('/messenger', messengerControllers);
app.use(errorHandler);

const PORT = process.env.PORT;
const server = http.createServer(app);
const io = useSocket(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  socket.on('CONVERSATION:NEW_MESSAGE', async (data) => {
    console.log('socket');

    let { conversationId, text, from, to, date } = data;

    const conversation = await Conversation.findOne({
      conversationId: Types.ObjectId(conversationId),
      from: Types.ObjectId(from),
      to: Types.ObjectId(to),
    });

    const message = new Message({
      text,
      date,
      conversation,
    });

    await message.save();

    const response = { ...data, _id: message._id };
    io.to(conversationId).emit('CONVERSATION:NEW_MESSAGE', response);
  });

  socket.on('CONVERSATION:JOIN', async (userId) => {
    const conversations = await Conversation.find({ from: Types.ObjectId(userId) });
    conversations?.forEach(conversation => {
      socket.join(conversation.conversationId.toString());
    })
  });

  socket.on('CONVERSATION:MESSAGE_SEEN', async (conversationIds) => {
    await Message.findOneAndUpdate(
      {conversationId: { $in: conversationIds }},
      {seen: true},
    );
  });
});

server.listen(PORT, () => console.log(`Server is running in PORT ${PORT}`));
