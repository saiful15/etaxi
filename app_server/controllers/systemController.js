require('dotenv').config({ slient: true });
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
const Path = require('path');
const Fs = require('fs');
const NodeMailer = require('nodemailer');
const Mongoose = require('mongoose');
const Document = Mongoose.model('docs');
const Statement = Mongoose.model('statement');
const Incomes = Mongoose.model('incomes');
const Expenses = Mongoose.model('expenses');
const PdfDocument = require('pdfkit');
const DateFormat = require('dateformat');
const Vehicles = Mongoose.model('vehicles');
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
					docLocation: req.params.userId+'/'+req.file.filename,
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

/*
|----------------------------------------------
| following function is a promise and will get
| user incomed based on id.
|----------------------------------------------
*/
function getIncomes(userId) {
	const userIncomes = [];
	return new Promise((resolve, reject) => {
		Incomes
			.find({ whos: userId })
			.exec((err, incomes) => {
				if (err) {
					reject(err);
				}
				else if (!incomes) {
					reject(err);
				}
				else {
					incomes.forEach((income) => {
						let incomeObj = {
							'incomeType': income.incomeType,
							'amount': income.income,
						};
						userIncomes.push(incomeObj);
					});
					resolve(userIncomes);
				}
			})				
	})
}


/*
|----------------------------------------------
| Following function is a promise will get user
| expense based on id.
|----------------------------------------------
*/
function getExpenses(userId) {
	const expensesList = [];
	return new Promise((resolve, reject) => {
		Expenses 
			.find({ whos: userId })
			.exec((err, expenses) => {
				if (err) {
					reject(err);
				}
				else if (!expenses) {
					reject('No expenses found for this user');
				}
				else {
					expenses.forEach((expense) => {
						let expenseObj = {
							'expense_sector': expense.expense_sector,
							'amount': expense.amount
						};
						expensesList.push(expenseObj);
					})
					
					console.log(expensesList);
					resolve(expensesList);
				}
			})
	})
}

/*
|----------------------------------------------
| get vehicle status to calculate estimated 
| tax.
|----------------------------------------------
*/
function getVechicleStatus(userId) {
    return new Promise((resolve, reject) => {
        Vehicles
            .findOne({ whos: userId })
            .exec((err, vehicle) => {
                if(err) {
                    reject(err);
                }
                else if(!vehicle) {
                    reject(`No vehicle found for this ${userId}`);
                }
                else {
                    resolve(vehicle.car_status);
                }
            })
    });
}

/*
|----------------------------------------------
| following function to generate account 
| statement.
|----------------------------------------------
*/
module.exports.generateStatement = (req, res) => {
	const userInfo = Joi.object().keys({
		userId: Joi.string().email().required(),
		userDirId: Joi.string().required(),
	});

	Joi.validate(req.params, userInfo, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err.details[0].message,
			});
		}
		else {
			let doc = new PdfDocument;
			const date = DateFormat(Date.now(), 'yyyy-mm-dd_h:MM:ss');
			const statementFileName = `${req.params.userDirId}/statment_${date}.pdf`;
			const fileName = `./users/${statementFileName}`;

			Promise.all([getIncomes(req.params.userId), getExpenses(req.params.userId), getVechicleStatus(req.params.userId)])
				.then(statementData => {
					doc.pipe (Fs.createWriteStream(`${fileName}`))
						doc.image('./public/assets/img/logo1-default.png', {
							fit: [110, 42],
							align: 'right',
							valign: 'right'
						});

						doc.moveDown();

						doc.font('./public/fonts/avenir-next-regular.ttf')
							.fontSize(20),
						doc.text(`Financial Statement For`, 80, 160, {
							width: 410,
							align: 'center'
						});

						doc.fontSize(16);
						doc.text(`${req.params.userId}`, 80, 180, {
							width: 410,
							align: 'center'
						});

						doc.fontSize(16)
						doc.text('Income Statement', 80, 240, {
							align: 'left',
						});

						statementData[0].forEach(income => {
							doc.fontSize(14);
							doc.moveDown(1);
							doc.text(`Income On ${income.incomeType}`, {
								align: 'left',
								fillColor: '#4a4a4a',
							});

							doc.text(`Amount £${income.amount}`, {
								align: 'right',
								fill: 'red'
							})
						});
					let total = 0;
					const onlyIncomes = statementData[0].map((income) => {
						return income.amount;
					})
					
					const totalIncome = onlyIncomes.reduce((income, total) => income + total);

					const carStatus = statementData[2];
					
					doc.fontSize(12)
					doc.text('------------------------------------------', {
						align: 'right'
					});
					doc.fontSize(17)
					doc.text(`Total Income £${totalIncome}`, {
						align: 'right'
					});

					doc.fontSize(16)
					doc.moveDown(5)
					doc.text('Expense Statement', {
						align: 'left',
					});

					// need empty space.
					doc.fontSize(20)
					doc.moveDown(3);
					doc.text('');

					statementData[1].forEach(expenses => {
						doc.fontSize(14);
						doc.moveDown(1);
						doc.text(`Expense On ${expenses.expense_sector}`, {
							align: 'left',
							fillColor: '#4a4a4a',
						});

						doc.fontSize(14)
						doc.text(`Amount £${expenses.amount}`, {
							align: 'right',
							fill: 'red'
						})
					});

					const onlyExpenses = statementData[1].map((expenses) => {
						return expenses.amount;
					});

					let totalx = 0;
					const totalExprense = onlyExpenses.reduce((expense, totalx) => expense + totalx);

					doc.fontSize(12);
					doc.moveDown(2);
					doc.text('------------------------------------------', {
						align: 'right'
					});
					doc.fontSize(17)
					doc.moveDown(1);
					doc.text(`Total Expense(s) £${totalExprense}`, {
						align: 'right'
					});

					let taxPayable = 0;
					let grossIncome = 0;
					let percentageAdjustment = 0.1;

					if(carStatus === 'finance' || carStatus === 'own') {
						let totalTaxAmount = 0;
						taxPayable = (totalIncome * process.env.NI_CONTRIBUTON) + (totalIncome * percentageAdjustment);
						grossIncome = parseFloat(totalIncome - totalExprense).toFixed(2);

						if (grossIncome > process.env.TAXFREE_INCOME) {
							let netDifference = parseFloat(grossIncome - process.env.TAXFREE_INCOME).toFixed(2);
							if (netDifference > 0) {
								totalTaxAmount = parseFloat(netDifference * 0.20).toFixed(2);
							}
							else {
								totalTaxAmount = 0;
							}
						}

						doc.fontSize(16);
						doc.moveDown(3);
						doc.text(`Estimated Tax Calculation`, {
							align: 'center'
						});

						// writing to pdf file.
						doc.fontSize(16);
						doc.moveDown(1);
						doc.text(`NI Contribution: ${process.env.NI_CONTRIBUTON}`, {
							align: 'left'
						});
						doc.moveDown(1);
						doc.text(`Percentage Adjustment: ${percentageAdjustment}`, {
							align: 'left'
						});
						doc.moveDown(1);
						doc.text(`Tax Payable: £${taxPayable}`, {
							align: 'left'
						});
						doc.moveDown(1);
						doc.text(`Gross Income: £${grossIncome}`, {
							align: 'left'
						});
						doc.moveDown(1);
						doc.text(`Estimated Tax: £${totalTaxAmount}`, {
							align: 'left'
						});
						doc.moveDown(1);
					}
					else if (carStatus === 'rented') {
						let taxPayable = 0;
						let percentageAdjustment = 0;
						let totalTaxAmount = 0;
						grossIncome = parseFloat(totalIncome - totalExprense).toFixed(2);
						taxPayable = (totalIncome * process.env.NI_CONTRIBUTON) + (totalIncome * percentageAdjustment);

						if (grossIncome > process.env.TAXFREE_INCOME) {
							let netDifference = parseFloat(grossIncome - process.env.TAXFREE_INCOME);

							if (netDifference > 0) {
								totalTaxAmount = parseFloat(netDifference * 0.20).toFixed(2);
							}
							else {
								totalTaxAmount = 0;
							}
						}

						doc.fontSize(16);
						doc.moveDown(3);
						doc.text(`Estimated Tax Calculation`, {
							align: 'center'
						});

						doc.text(`NI Contribution: ${process.env.NI_CONTRIBUTON}`, {
							align: 'left'
						});
						doc.moveDown(1);
						doc.text(`Percentage Adjustment: ${percentageAdjustment}`, {
							align: 'left'
						});
						doc.moveDown(1);
						doc.text(`Tax Payable: £${taxPayable}`, {
							align: 'left'
						});
						doc.moveDown(1);
						doc.text(`Gross Income: £${grossIncome}`, {
							align: 'left'
						});
						doc.moveDown(1);
						doc.text(`Estimated Tax: £${totalTaxAmount}`, {
							align: 'left'
						});
						doc.moveDown(1);

					}
					doc.end();
				})
				.catch(err => {
					incomeText = err;
				});

			// creating statement record in mongodb
			const statement = new Statement();
			statement.statementId = uid(10);
			statement.whos = req.params.userId;
			statement.documentDir = statementFileName;

			statement.save(err => {
				if (err) {
					sendJsonResponse(res, 404, {
						error: err,
					});
				}
				else {
					sendJsonResponse(res, 200, {
						success: true,
						docLoc: statementFileName,
					});
				}
			})
		}
	})
}

