const multer = require('multer');

const storage = multer.diskStorage({
    limits: {
        fileSize: 2000000,
    },
    destination: function (req, res, cb) {
        cb(undefined, 'uploads/')
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Invalid image!"));
        }

        cb(undefined, true);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;