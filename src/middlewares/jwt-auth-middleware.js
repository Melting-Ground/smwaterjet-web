const AuthorizationHeader = require('@jwt/authorization-header'); 
const tokenVerifier = require('@jwt/jwt-token-provider'); 
const Exception = require('../exceptions/exceptions');

const authenticateToken = (req, res, next) => {
    const authHeader = new AuthorizationHeader(req.headers['authorization']);
    const token = authHeader.getToken(); 

    const verified = tokenVerifier.verifyToken(token); 
    req.admin = verified;

    if (isValid == false) {
        throw new Exception('AuthenticationException', 'Invalid credentials');
    }
    
    next();
};

module.exports = authenticateToken;