const { User } = require('../helpers/db');

async function getCurrent(userId, token) {
    return { userId, token }
}

async function getUsers(req, res, next) {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);


    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const usersCount = await User.countDocuments().exec();
    const results = { count: usersCount };

    if (endIndex < usersCount) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }

    try {
        const credientails = ['userName', 'email', 'createdAt', 'contact'];
        results.results = await User.find().select(credientails).limit(limit).skip(startIndex).exec();
        res.paginatedResults = results;
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
    return results;
}

async function deleteUser(userId, res) {
    try {
        const deleteCandidate = await User.findById(userId);

        if (!deleteCandidate) {
            throw { msg: 'No user found' };
        }
        await deleteCandidate.deleteOne();
        return { msg: 'User successfully deleted' }
    } catch(e) {
        res.status(500).json({ msg: e.message || e.msg });
    }
}

async function editUser(req, res) {
    const { edit } = req.body;
    const id = edit._id || edit.id;
    try {
        const editCandidate =  await User.findById(id);

        if (!editCandidate) {
            return { msg: "Something broke" };
        }

        await editCandidate.updateOne(edit);

        return { msg: "Successfully Update" };
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }

}


module.exports = {
    getCurrent,
    getUsers,
    deleteUser,
    editUser
}