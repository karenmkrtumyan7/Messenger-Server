const { User } = require('../helpers/db');

async function getCurrent(userId, token) {
    return { userId, token }
}

async function getUsers() {
    const usersCollection = await User.find().select(['userName', 'email', 'createdAt', 'contact']);
    return usersCollection;
}

async function deleteUser(userId) {
    const deleteCandidate = await User.findById(userId);

    if (!deleteCandidate) {
        throw { msg: 'No user found' };
    }
    await deleteCandidate.deleteOne();
    return { msg: 'User successfully deleted' }
}

module.exports = {
    getCurrent,
    getUsers,
    deleteUser
}