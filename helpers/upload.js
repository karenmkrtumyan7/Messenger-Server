const multer  = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, './assets')
  },
  filename: function (req, file, cb) {
    // You could rename the file name
    // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))

    // You could use the original name
    cb(null, file.originalname)
  }
});

const upload = multer({storage: storage});

module.exports = upload;