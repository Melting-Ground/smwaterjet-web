const db = require('@configs/knex');
const argon2 = require('argon2');
const Exception = require('@exceptions/exception');

const userAuthenticate = async (req, res, next) => {
    try {
        const { inquiryId } = req.params;
        const { password } = req.query;
        if (password == null) {
            throw new Exception('BadRequestException', 'Password query parameter is required');
        }

        const user = await db('inquiries').where({ id: inquiryId }).select('password').first();

        if (user == null) {
            throw new Exception('ValueNotFoundException', 'Inquiry is not found');
        }

        const isPasswordValid = await argon2.verify(user.password, password);

        if (isPasswordValid == null) {
            throw new Exception('AuthenticationException', 'Invalid password');
        }
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = userAuthenticate;