class AuthorizationHeader{
    constructor(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('Invalid authorization header');
        }
        this.authHeader = authHeader;
    }
    getToken() {
        return this.authHeader.substring('Bearer '.length);
    }
}

module.exports = AuthorizationHeader;
