const { User } = require('../helpers/db');

async function getCurrent(userId, token) {
    return { userId, token }
}

async function getUsers() {
    const usersCollection = await User.find().select(['userName', 'email', 'createdAt']);
    return usersCollection;
}

module.exports = {
    getCurrent,
    getUsers
}