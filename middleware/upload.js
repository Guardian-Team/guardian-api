const multer = require('multer');

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    // no larger than 5mb.
    fileSize: 10 * 1024 * 1024,
  },
})

module.exports = multerMid;
