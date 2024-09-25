const AuthorizationHeader = require('./authorization-header'); 
const { verifyToken } = require('./jwt/jwt-token-provider'); 

const authenticateToken = (req, res, next) => {
    const authHeader = new AuthorizationHeader(req.headers['authorization']);
    const token = authHeader.getToken(); 

    const verified = verifyToken(token); 
    req.admin = verified;

    if (!isValid) {
        return res.sendStatus(403);
    }
    
    next();
};

module.exports = authenticateToken;