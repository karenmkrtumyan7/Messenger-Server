const express = require('express');
const cors = require('cors');
const bodyParser   = require('body-parser');
const corsOptions = require('./helpers/corsOptions');
const errorHandler = require('./helpers/errorHandler');
const authControllers = require('./controllers/auth.controllers');
const userControllers = require('./controllers/user.controllers');
const dotenv = require('dotenv').config;

const app = express();
dotenv();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/auth', authControllers);
app.use('/user', userControllers);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server is running in PORT ${PORT}`));