const { Schema, model } = require('mongoose');

const Permission = new Schema({
  users: {
    VIEW: { type: Boolean, default: true, required: true },
    CREATE: { type: Boolean, default: false, required: true },
    EDIT: { type: Boolean, default: false, required: true },
    DELETE: { type: Boolean, default: false, required: true },
  }
});

module.exports = model('Permission', Permission);
