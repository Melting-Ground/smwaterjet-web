const FormData = require("form-data");
const Exception = require('@exceptions/exception');
require('dotenv').config();

const handlePost = async (token) => {
	if (token == null) {
        throw new Exception('BadRequestException', 'TurnstileToken is missing');
	};
	let formData = new FormData();
	formData.append("secret", process.env.CAPTCHA_SECRETKEY);
	formData.append("response", token);
  
	const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
	const result = await fetch(url, {
	  method: "POST",
	  body: formData,
	});
  
	const outcome = await result.json();
	if (outcome.success == false) {
        throw new Exception('UnprocessableEntityException', 'Verification is failed');
	};
};

module.exports = { handlePost };