const multer = require('multer');
const path = require('path');
const fs = require('fs'); 

const createMulter = (category) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = `../../uploads/${category}/`; 
      fs.mkdir(uploadPath, { recursive: true }, (err) => {
        if (err) {
          return cb(err); 
        }
        cb(null, uploadPath); 
      });
    },

    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
  return multer({ storage: storage }); 
};

module.exports = createMulter;
