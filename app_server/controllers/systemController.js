/*
|----------------------------------------------
| setting up controller for system
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/

'use strict';

const Joi = require('joi');
const multer = require('multer');
const uid = require('uid');
const NodeMailer = require('nodemailer');
const Mongoose = require('mongoose');
const Document = Mongoose.model('docs');
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
	name: Joi.string().min(2).max(24).regex(/^[a-zA-Z ]{3,24}$/).required(),
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
			
			// setting up nodemail trans
			const smtpPool = {
				service: 'gmail',
				port: 25,
				secure: false,
				auth: {
					user: process.env.mailuser,
					pass: process.env.mailpass,
				},
				tls: {
					rejectUnauthorized: false,
				}
			};

			const transporter = NodeMailer.createTransport(smtpPool);

			transporter.verify((err, success) => {
				if (err) {
					sendJsonResponse(res, 400, {
						error: 'Error! while connecting with mail server. Contact admin',
					});
					return;
				}
				else{
					const message = {
						form: process.env.mailuser,
						to: process.env.mailuser,
						subject: `Customer enquery - ${req.body.name}`,
						html: `<p>${req.body.body} <br/><br/> Best regards, <br/> ${req.body.name} <br/> ${req.body.email}</p>`,
					};
					// send mail
					transporter.sendMail(message , (err, info) => {
						if (err) {
							sendJsonResponse(res, 400, {
								error: 'Error! while sending email. Contact admin',
							});
							return;
						}
						else{
							return sendJsonResponse(res, 200, {
								success: true,
							});
						}
					})
				}
			})
		}
	})
}


/*
|----------------------------------------------
| Following function to upload file
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.uploadFile = (req, res) => {
	var storage = multer.diskStorage({
	destination: function(req, file, cb) {
      cb(null, './users/'+req.params.userId);
    	},
	    filename: function(req, file, cb) {
	        if (!file.originalname.match(/\.(png|jpeg|jpg|JPG|pdf)$/)) {
	            var err = new Error();
	            err.code = 'filetype';
	            return cb(err);
	        } else {
	        	var fileid 		=	uid(8);
	        	cb(null, fileid+file.originalname);
	        }
	    }
	});
	var upload = multer({
	    storage: storage,
	    limits: { fileSize: 5000000 }
	}).single('accountImg');

	upload(req, res, function(err){
		if(err){
			if(err.code === 'LIMIT_FILE_SIZE'){
				sendJsonResponse(res, 404, {
					success: false,
					error: "File size is too large"
				});
			}
			else if(err.code === 'filetype'){
				sendJsonResponse(res, 404, {
					success: false,
					error : "Invalid file type"
				});
			}
			else {
				sendJsonResponse(res, 404, {
					success: false,
					error: "Enable to upload!"
				});
			}
		}
		else{
			if(!req.file){
				sendJsonResponse(res, 404, {
					success: false,
					error: "Please select a product image"
				});
			}
			else{
				sendJsonResponse(res, 200, {
					success: true,
					filename: req.file.filename,
					fileLocation: './users/'+req.params.userId+'/'+req.file.filename,
				});
			}
		}
	});


}

module.exports.documentUpload = (req, res) => {
	var storage = multer.diskStorage({
	destination: function(req, file, cb) {
      cb(null, './users/'+req.params.userId);
    	},
	    filename: function(req, file, cb) {
	        if (!file.originalname.match(/\.(png|jpeg|jpg|JPG|pdf)$/)) {
	            var err = new Error();
	            err.code = 'filetype';
	            return cb(err);
	        } else {
	        	var fileid 		=	uid(8);
	        	cb(null, fileid+file.originalname);
	        }
	    }
	});
	var upload = multer({
	    storage: storage,
	    limits: { fileSize: 5000000 }
	}).single('accountDocs');

	upload(req, res, function(err){
		if(err){
			if(err.code === 'LIMIT_FILE_SIZE'){
				sendJsonResponse(res, 404, {
					success: false,
					error: "File size is too large"
				});
			}
			else if(err.code === 'filetype'){
				sendJsonResponse(res, 404, {
					success: false,
					error : "Invalid file type"
				});
			}
			else {
				sendJsonResponse(res, 404, {
					success: false,
					error: "Enable to upload!"
				});
			}
		}
		else{
			if(!req.file){
				sendJsonResponse(res, 404, {
					success: false,
					error: "Please select a product image"
				});
			}
			else{
				sendJsonResponse(res, 200, {
					success: true,
					docLocation: '/users/'+req.params.userId+'/'+req.file.filename,
				});
			}
		}
	});
}

module.exports.insertDocumentInfo = (req, res) => {
	const documentInfo = Joi.object().keys({
		name: Joi.string().min(3).max(24).regex(/^[a-zA-Z0-9 ]{3,24}$/).required(),
		whatFor: Joi.string().min(3).max(24).regex(/^[a-zA-Z0-9 ]{3,24}$/).required(),
		whosFor: Joi.string().min(3).max(24).regex(/^[a-zA-Z0-9 ]{3,24}$/).required(),
		docId: Joi.string().min(24).max(24).regex(/^[a-z0-9]{24,24}$/).required(),
		uploader: Joi.string().min(24).max(24).regex(/^[a-z0-9]{24,24}$/).required(),
		docLocation: Joi.string().required(),
	});

	Joi.validate(req.body, documentInfo, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			return;
		}
		else {
			Document.create({
				docId : req.body.docId,
				uploader : req.body.uploader,
				name : req.body.name,
				whatFor : req.body.whatFor,
				whosFor: req.body.whosFor,
				docLocation : req.body.docLocation,
			}, (err, doc) => {
				if (err) {
					sendJsonResponse(res, 404, {
						error: err,
					});
					return;
				}
				else {
					sendJsonResponse(res, 200, {
						success: true,
					});
				}
			});
		}
	})
}

module.exports.checkDocs = (req, res) => {
	const userId = Joi.object().keys({
		userId: Joi.string().required(),
	});

	Joi.validate(req.params, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
			console.log('err', err);
		}
		else {
			Document
				.find({ uploader: req.params.userId })
				.exec((err, doc) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
					}
					else if (!doc) {
						sendJsonResponse(res, 404, {
							error: 'No doc found',
						});
					}
					else {
						sendJsonResponse(res, 200, {
							success: true, 
							doc: doc
						});
					}
				})
		}
	});
}

