const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const createMulter = (category) => {
  const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
      const uploadPath = `uploads/${category}/`;
      try {
        await fs.mkdir(uploadPath, { recursive: true });
        cb(null, uploadPath);
      } catch (err) {
        cb(err);
      }
    },

    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  return multer({ storage: storage });
};

module.exports = createMulter;
