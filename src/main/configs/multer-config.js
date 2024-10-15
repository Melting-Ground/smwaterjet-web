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
      const uniqueSuffix = Date.now();
      const originalName = path.basename(file.originalname, path.extname(file.originalname));
      const ext = path.extname(file.originalname);
      cb(null, `${uniqueSuffix}-${originalName}${ext}`);
    }
  });
  return multer({ storage: storage });
};

module.exports = createMulter;
