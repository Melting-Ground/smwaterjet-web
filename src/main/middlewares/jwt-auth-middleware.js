const AuthorizationHeader = require('@jwt/authorization-header');
const tokenVerifier = require('@jwt/jwt-token-provider');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = new AuthorizationHeader(req.body.headers['authorization']);
        const token = authHeader.getToken(); 
    
        await tokenVerifier.verifyToken(token); 
    
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authenticate;