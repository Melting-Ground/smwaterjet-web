const db = require('@configs/knex');
const argon2 = require('argon2');
const Exception = require('@exceptions/exception');

const userAuthenticate = async (req, res, next) => {
    try {
        const { inquiryId } = req.params;
        const { password } = req.body;
        const user = await db('inquiries').where({ id: inquiryId }).select('password').first();

        if (!user) {
            throw new Exception('ValueNotFoundException', 'Inquiry is not found');
        }
        const isPasswordValid = await argon2.verify(user.password, password);

        if (!isPasswordValid) {
            throw new Exception('AuthenticationException', 'Invalid password');
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = userAuthenticate;