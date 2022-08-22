const multer  = require('multer');
const path = require('path');
const { User } = require('./db');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/avatars');
  },
  filename: function (req, file, cb) {
    cb(null, req.userId + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
