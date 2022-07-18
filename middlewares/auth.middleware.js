const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config;
dotenv();

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const { userId, role } = decodedToken;

    if (req.params.userid && req.params.userid !== userId) {
      throw 'Invalid request';
    } else {
      req.token = token;
      req.userId = userId;
      req.role = role
      next();
    }
  } catch(err) {
    res.status(401).json({
      msg: err,
    });
  }
};
