const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

module.exports = {
    User: require('../models/user.model'),
    Role: require('../models/role.model'),
    Permission: require('../models/permission.model'),
    Message: require('../models/message.model'),
    Conversation: require('../models/conversation.model'),
};
