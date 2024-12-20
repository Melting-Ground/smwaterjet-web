const FormData = require("form-data");
const Exception = require('@exceptions/exception');
require('dotenv').config();

const handlePost = async (token) => {
	if (token == null) {
        throw new Exception('BadRequestException', 'TurnstileToken is missing');
	};
	if (process.env.CAPTCHA_SECRETKEY == null) {
        throw new Exception('ConfigurationException', 'CAPTCHA_SECRETKEY is not set in environment variables');
    }
	let formData = new FormData();
	formData.append("secret", process.env.CAPTCHA_SECRETKEY);
	formData.append("response", token);
  
	const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
	const result = await fetch(url, {
		method: "POST",
		body: formData,
		headers: {
			...formData.getHeaders(), 
		},
	});
  
	const outcome = await result.json();
	if (outcome.success == false) {
        throw new Exception('UnprocessableEntityException', 'Verification is failed');
	};
	return outcome.success;
};

module.exports = { handlePost };