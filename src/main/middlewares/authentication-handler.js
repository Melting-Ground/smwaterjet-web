const userAuthenticate = require('@middlewares/user-authentication');
const authenticate = require('@middlewares/jwt-authentication');

const authenticationHandler = async (req, res, next) => {
	try {
		const { password } = req.query;
		if (password != null) {
            await userAuthenticate(req, res, next);
        } else {
            await authenticate(req, res, next);
        }
	} catch (error) {
		next(error);
	}
};

module.exports = authenticationHandler;