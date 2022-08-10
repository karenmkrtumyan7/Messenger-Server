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
    let { conversationId, from, to, text, date } = data;

    if (!conversationId) {
      const fromToConnection = await Conversation.findOne({ from, to });

      if (_.isEmpty(fromToConnection)) {
        const toFromConnection = await Conversation.findOne({ from: to, to: from });
        if (_.isEmpty(toFromConnection)) {
          const conversation = new Conversation({ from, to });
          conversationId = conversation.conversationId;
          await conversation.save();
        } else {
          conversationId = toFromConnection.conversationId;
          const conversation = new Conversation({ from, to, conversationId });
          await conversation.save();
        }
      } else {
        conversationId = fromToConnection.conversationId;
      }
    }

    const conversation = await Conversation.findOne({ conversationId });
    const message = new Message({
      text,
      date,
      conversation,
    });

    await message.save();

    const response = { ...data, _id: message._id };

    socket.broadcast.emit('CONVERSATION:NEW_MESSAGE', response);
  });
});

server.listen(PORT, () => console.log(`Server is running in PORT ${PORT}`));
