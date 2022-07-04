const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config;
dotenv();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(1);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken);
    const userId = decodedToken.userid;

    if (req.params.userid && req.params.userid !== userId) {
      throw 'Invalid user ID';
    } else {
      req.token = token;
      req.userId = userId;
      next();
    }
  } catch {
    res.status(401).json({
      msg: 'Invalid request'
    });
  }
};