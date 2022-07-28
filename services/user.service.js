const moment = require('moment');
const { User, Permission } = require('../helpers/db');
const _ = require('lodash');

async function getUserDetails(req, res) {
    const userDetails = await User.findById(req.userId).select('-password').find()
      .populate({
          select: '-password',
          path: 'role',
          select: 'value isAdmin -_id',
          populate: {
              path: 'permissions',
              select: '-_id'
          }
      });
    return userDetails[0];
}

async function getUser(req) {
    const userDetails = await User.findById(req.params.id).select('email  userName contact  verified createdAt')
      .find()
      .populate({
          path: 'role',
          select: 'value',
      });
    const formatUser = _.pick(userDetails[0], ['email', 'createdAt', 'userName', 'contact', 'verified']);
    formatUser.role = _.get(userDetails, '[0].role.value')
    return formatUser;
}

async function getUsers(req, res) {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const startIndex = (page - 1) * pageSize;
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
                    },
                },
            },
        }
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

    if (pageSize) {
        aggregateParams.push({
            $limit : pageSize ,
        })
    }

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

async function updatePermissions(req, res) {
    const { id } = req.params;
    const { updatePermissionsData } = req.body;

    try {
        const userDetails = await User.findById(id).select('-password').find()
          .populate({
              path: 'role',
              populate: {
                  path: 'permissions',
              }
          });

        if (!userDetails[0]) {
            return { msg: "Something broke" };
        }

        await Permission.updateOne({ _id: userDetails[0].role.permissions._id }, { users: updatePermissionsData });

        return { msg: "Successfully Update" };
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

async function getPermissions(req, res) {
    const { id } = req.params;

    try {
        const userDetails = await User.findById(id).select('-password').find()
          .populate({
              path: 'role',
              populate: {
                  path: 'permissions',
              }
          });

        if (!userDetails[0]) {
            return { msg: "Something broke" };
        }

        return _.get(userDetails[0], 'role.permissions');
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

module.exports = {
    getUserDetails,
    getUsers,
    getUser,
    deleteUser,
    editUser,
    updatePermissions,
    getPermissions,
}
