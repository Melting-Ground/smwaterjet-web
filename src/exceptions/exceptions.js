class AuthenticationException extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthenticationException'; 
    }
}

class ValueAlreadyExistsException extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValueAlreadyExistsException';
    }
}

class ValueNotFoundException extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValueNotFoundException'; 
    }
}

module.exports = {
    AuthenticationException,
    ValueNotFoundException,
    ValueAlreadyExistsException,
};
