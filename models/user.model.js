const { Schema, model } = require('mongoose');

const schema = new Schema({
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false },
    contact: { type: String, required: true }
},{
    collection: 'users',
    timestamps: true
});

module.exports = model('User', schema);