const { Schema, model } = require('mongoose');

const Role = new Schema({
  value: { type: String, enum: ['Admin', 'User', 'Moderator'], default: 'User', required: true },
  isAdmin: { type: Boolean, default: false, required: true },
  permissions: { type: Object, ref: 'Permission' }
});

module.exports = model('Role', Role);
