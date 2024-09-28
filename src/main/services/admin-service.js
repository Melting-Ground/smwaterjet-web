const db = require('../db/knex'); 
const Exception = require('../exceptions/exceptions');
const jwtTokenProvider = require('../jwt/jwt-token-provider');
const argon2 = require('argon2');

const loginAdmin = async (adminDto) => {
    const admin = await db('admins')
        .where({ phone_number: adminDto.phoneNumber })
        .first();
        
    console.log(admin);

    if (admin == null) {
        throw new Exception('ValueNotFoundException','Admin not found');
    }

    const passwordValid = await argon2.verify(admin.password_hash, adminDto.password);
    if (passwordValid == false) {
        throw new Exception('AuthenticationException','Invalid password');
    }

    const token = jwtTokenProvider.generateToken(admin);
    return token;
};

module.exports = {loginAdmin};
