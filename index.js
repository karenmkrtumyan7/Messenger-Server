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
  socket.on('CONVERSATION:JOIN', (data) => {
    console.log(data);
  });
  console.log('socket connection');
});

server.listen(PORT, () => console.log(`Server is running in PORT ${PORT}`));
