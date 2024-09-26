const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRETKEY;

const generateToken = (admin) => {
    return jwt.sign({ id: admin.phoneNumber }, secretKey, { expiresIn: '3h' });
};
  
const verifyToken = (token) => {
    try {
      jwt.verify(token, secretKey);
      return true;
    } catch (error) {
      return false;
    }
};

module.exports = {generateToken, verifyToken};


