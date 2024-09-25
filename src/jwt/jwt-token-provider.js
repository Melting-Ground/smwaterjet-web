const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRETKEY;

const generateToken = (admin) => {
    return jwt.sign({ id: admin.phoneNumber }, secretKey, { expiresIn: '1h' });
};
  
const verifyToken = (token) => {
    try {
      return jwt.verify(token, secretKey);
    } catch (error) {
      throw new Error('Invalid token');
    }
};

module.exports = {generateToken, verifyToken};


