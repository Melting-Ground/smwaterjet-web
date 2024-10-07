const multer = require('multer');
const path = require('path');
const fs = require('fs').promises; 

const createMulter = (category, useTimestamp = false) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = useTimestamp
        ? `uploads/${category}/${category}-${Date.now()}`
        : `uploads/${category}/`;
        
      fs.mkdir(uploadPath, { recursive: true }, (err) => {
        if (err) {
          return cb(err); 
        }
        cb(null, uploadPath); 
      });
    },

    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  return multer({ storage: storage }); 
};

module.exports = createMulter;
