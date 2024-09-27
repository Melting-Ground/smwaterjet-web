const AuthorizationHeader = require('@jwt/authorization-header'); 
const tokenVerifier = require('@jwt/jwt-token-provider'); 

const authenticate = (req, res, next) => {
    const authHeader = new AuthorizationHeader(req.headers['authorization']);
    const token = authHeader.getToken(); 

    tokenVerifier.verifyToken(token); 

    next();
};

module.exports = authenticate;