const moment = require('moment');
const { User } = require('../helpers/db');

async function getCurrent(userId, token) {
    return { userId, token }
}

async function getUsers(req, res) {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const usersCount = await User.countDocuments();
    const results = { count: usersCount };
    const aggregateParams = [
        { $skip : startIndex },
        {
            $project : {
                _id: "$_id",
                key: "$_id",
                userName: "$userName",
                contact: "$contact",
                email: "$email",
                createdAt:  {
                    $dateToString: {
                        format:"%Y-%m-%d",
                        date:"$createdAt"
                    }
                },
            },
        },
    ];
    const { userName, contact, email, createdAt } = req.query;

    const getFormattedDate = (date) => moment(date)
      .utc(date)
      .local()
      .format('YYYY-MM-DD');

    if (userName) {
        aggregateParams.push({
            $match: { userName }
        })
    }

    if (contact) {
        aggregateParams.push({
            $match: { contact },
        });
    }

    if (email) {
        aggregateParams.push({
            $match: { email },
        });
    }

    if (createdAt) {
        aggregateParams.push({
            $match: { createdAt: getFormattedDate(createdAt) },
        })
    }

    aggregateParams.push({
        $limit : limit ,
    })

    try {
        results.data = await User.aggregate(aggregateParams);
        return results;
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
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
    const { userName, contact, email } = req.body;
    const { id } = req.params;
    try {
        const editCandidate =  await User.findById(id);

        if (!editCandidate) {
            return { msg: "Something broke" };
        }

        await editCandidate.updateOne({ userName, contact, email });

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