const { Schema, model } = require('mongoose');

const Permission = new Schema({
  users: {
    view: { type: Boolean, default: true, required: true },
    create: { type: Boolean, default: false, required: true },
    edit: { type: Boolean, default: false, required: true },
    delete: { type: Boolean, default: false, required: true },
  }
});

module.exports = model('Permission', Permission);
