const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the directory where you want to store the uploaded files
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    // Set the file name as the current timestamp plus the original file extension
    const timestamp = Date.now();
    const fileExtension = file.originalname.split('.').pop();
    cb(null, `${timestamp}.${fileExtension}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;