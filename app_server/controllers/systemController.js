/*
|----------------------------------------------
| setting up controller for system
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/

'use strict';

const Joi = require('joi');
/*
|----------------------------------------------------------------
| function for returning json.
|----------------------------------------------------------------
*/
const 			sendJsonResponse	=	(res, status, content) => {
	res.status(status);
	res.json(content);
};

// defining Joi object for message.
const message = Joi.object().keys({
	name: Joi.string().min(2).max(24).regex(/^[a-zA-Z]{3,24}$/).required(),
	email: Joi.string().email().required(),
	body: Joi.string().min(2).max(250).required(),
});

module.exports.sendMessage = (req, res) => {
	Joi.validate(req.body, message, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			sendJsonResponse(res, 200, req.body);
		}
	})
}
