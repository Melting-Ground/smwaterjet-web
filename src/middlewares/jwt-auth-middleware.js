const AuthorizationHeader = require('@jwt/authorization-header'); 
const tokenVerifier = require('@jwt/jwt-token-provider'); 

const authenticateToken = (req, res, next) => {
    const authHeader = new AuthorizationHeader(req.headers['authorization']);
    const token = authHeader.getToken(); 

    const verified = tokenVerifier.verifyToken(token); 
    req.admin = verified;

    if (!isValid) {
        return res.sendStatus(403);
    }
    
    next();
};

module.exports = authenticateToken;