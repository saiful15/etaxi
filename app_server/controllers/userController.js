/*
|----------------------------------------------
| setting up user controller 
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxi, 2017
|----------------------------------------------
*/
var 		mongoose 		=		require('mongoose'),
			Joi 				=		require('joi'),
			users 			=		mongoose.model('users');


var 		sendJsonResponse 	=	function(res, status, content){
	res.status(status);
	res.json(content);
}

const userId = Joi.object().keys({
	userId: Joi.string().email().min(3).required(),
});

/*
|----------------------------------------------
| Following method will get the user object
| from the database
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccount, 2017
|----------------------------------------------
*/
module.exports.showUser = (req, res) => {
	if (!req.params && !req.params.email) {
		sendJsonResponse(res, 404, {
			error: 'Invalid request. email address is required',
		});
	}
	else {
		const email = Joi.object().keys({
			email: Joi.string().email().min(3).required(),
		});
		Joi.validate(req.params, email, (err, value) => {
			if (err) {
				sendJsonResponse(res, 404, {
					error: err,
				});
				return;
			}
			else {
				users
					.findOne({email: req.params.email})
					.exec((err, user) => {
						if (err) {
							sendJsonResponse(res, 404, {
								error: err,
							});
							return;
						}
						else if (!user) {
							sendJsonResponse(res, 404, {
								error: `No user found with ${req.params.email}`,
							});
							return;						
						}
						else{
							sendJsonResponse(res, 200, {
								user: user,
							});
						}
					})
			}
		})
	}
}

/*
|----------------------------------------------
| Following function get all status collection.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxi, 2017
|----------------------------------------------
*/
module.exports.getStatusCollection 		=		function(req, res){
	if(!req.params && !req.params.email){
		sendJsonResponse(res, 404, {
			message: "Invalid request"
		});
	}
	else{
		// calling users model and run the query.
		users
			.findOne({email: req.params.email})
			.select('statusCollection')
			.exec(function(err, statusCollection){
				if(!statusCollection){
					sendJsonResponse(res, 404, {
						error: 'No status collections found with this email address.'
					});
				}
				else if(err){
					sendJsonResponse(res, 404, {
						error: err
					});
				}
				else{					
					sendJsonResponse(res, 200, {
						status: statusCollection
					});
				}
			})
	}
}


/*
|----------------------------------------------
| Following function will create user personal 
| profile
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxi, 2017
|----------------------------------------------
*/
module.exports.createProfile 			=		function(req, res){
	if(!req.params && !req.params.email){
		sendJsonResponse(res, 404, {
			error: "Invalid request"
		});
	}
	else{
		if(!req.body.first_name || !req.body.last_name || !req.body.house_no || !req.body.street_name
			|| !req.body.city_name || !req.body.county || !req.body.postcode){
			sendJsonResponse(res, 404, {
				error: "All fields are required. Must not be empty"
			});
			return false;
		}
		else{
			users
				.findOne({email: req.params.email})
				.select('profile')
				.exec(function(err, user){
					if(err){
						sendJsonResponse(res, 404, {
							error: err
						});
					}
					else if(!user){
						sendJsonResponse(res, 404, {
							error: "no user found with this email address"
						});
					}
					else{
						var 	address 	={
							house_number: req.body.house_no,
							street_name: req.body.street_name,
							postcode: req.body.postcode,
							city_name: req.body.city_name,
							county: req.body.county
						};
						user.profile.push({
							created_at: Date.now(),
							first_name: req.body.first_name,
							last_name: req.body.last_name,
							address: address
						});
						// saving the profile
						user.save(function(err, user){
							if(err){
								sendJsonResponse(res, 404, {
									error: err
								});
							}
							else{
								sendJsonResponse(res, 200, {
									profile: user.profile
								});
							}
						})

					}
				})
		}
	}
}


/*
|----------------------------------------------
| following function will update the user status
| according to given user.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxi, 2017
|----------------------------------------------
*/
module.exports.updateStatus 		=		function(req, res){
	if(!req.body.email || !req.body.status || !req.body.update_at){
		sendJsonResponse(res, 404, {
			error: "Invalid request."
		});
	}
	else{
		// find user according to email address.
		users
			.findOne({email: req.body.email})
			.select('statusCollection')
			.exec(function(err, user){
				if(err){
					sendJsonResponse(res, 404, {
						error: err
					});
				}
				else if(!user){
					sendJsonResponse(res, 404, {
						error: "user not found with given email address"
					});
					return;
				}
				else{
					if(user.statusCollection && user.statusCollection.length > 0){
						var newStatus 	=	user.statusCollection[0];
						newStatus[req.body.update_at] = req.body.status;												
						// now save the change.
						user.save(function(err, user){
							if(err){
								sendJsonResponse(res, 404, {
									error: err
								});
								return;
							}
							else{
								sendJsonResponse(res, 200, {
									updated: true
								});
							}
						})
					}
				}
			})
	}
}

/*
|----------------------------------------------
| Following function will get user profile 
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxiaccounting, 2017
|----------------------------------------------
*/
module.exports.getUserProfile 		=		function(req, res){
	if(!req.params && !req.params.email){
		sendJsonResponse(res, 404, {
			error: "Invalid request"
		});
	}
	else{
		// now calling users mongoose model to query.
		users
			.findOne({email: req.params.email})
			.select('profile')
			.exec(function(err, user){
				if(!user){
					sendJsonResponse(res, 404, {
						error: "No user found for this email address"
					});
				}
				else if(err){
					sendJsonResponse(res, 404, {
						error: err
					});
				}
				else{
					sendJsonResponse(res, 200, {
						success: true,
						profile: user
					});
				}
			})
	}
}


/*
|----------------------------------------------
| following function will update user person address
| based on given id.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxi, 2017
|----------------------------------------------
*/
module.exports.updateAddress 		=		function(req, res){
	if(!req.params && !req.params.userId){
		sendJsonResponse(res, 404, {
			error: "Invalid request"
		});
	}
	else {
		if(!req.body.house_number || !req.body.street_name || !req.body.post_code || !req.body.city ||
			!req.body.county) {
			sendJsonResponse(res, 404, {
				error: "All fields required. Must not be empty"
			});
		}
		else{
			// find user with given id.
			users
				.findById({"_id": req.params.userId})
				.select('profile')
				.exec(function(err, user){
					var newAddress;
					if(err){
						sendJsonResponse(res, 404, {
							error: err
						});
						return;
					}
					else if(!user){
						sendJsonResponse(res, 404, {
							error: "user not found with given id"
						});
						return;
					}
					else{
						// finding subdocuments.
						if(user.profile && user.profile.length > 0){
							newAddress = user.profile[0].address;
							// adding new address.
							newAddress[0].county = req.body.county;
							newAddress[0].city_name = req.body.city;
							newAddress[0].postcode = req.body.post_code;
							newAddress[0].street_name = req.body.street_name;
							newAddress[0].house_number = req.body.house_number;
							// now save these new address.
							user.save(function(err, user){
								if(err){
									sendJsonResponse(res, 404, {
										error: err
									});
									return;
								}
								else {
									sendJsonResponse(res, 200, {
										success: newAddress
									});
								}
							})
						}
						else{
							sendJsonResponse(res, 404, {
								error: "no address found"
							});
							return;
						}
					}
				})
		}
	}
}


/*
|----------------------------------------------
| Following function will add additional info
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxiaccounting, 2017
|----------------------------------------------
*/
module.exports.saveAdditionInfo 		=		function(req, res){
	if(!req.params && !req.params.userId){
		sendJsonResponse(res, 404, {
			error: "Invalid request"
		});
	}
	else {
		if(!req.body.ni_number || !req.body.uti_number){
			sendJsonResponse(res, 404, {
				error: "All fields are required. Must not be empty"
			});
		}
		else{
			users
				.findById({_id: req.params.userId})
				.select('additional_info')
				.exec(function(err, user){
					if(!user){
						sendJsonResponse(res, 404, {
							error: "No user found with given user id"
						});
						return;
					}
					else if(err){
						sendJsonResponse(res, 404, {
							error: err
						});
						return;
					}
					else{
						user.additional_info.push({
							ni_number: req.body.ni_number,
							uti_number: req.body.uti_number,
							created_at: Date.now()
						});

						// saving this new info.
						user.save(function(err, user){
							if(err){
								sendJsonResponse(res, 404, {
									error: err
								});
								return;
							}
							else {
								sendJsonResponse(res, 200, {
									additionalInfo: user.additional_info
								});
							}
						})
					}
				})
		}
	}
}

/*
|----------------------------------------------
| Following function will add expense to the user
| collection.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.addExpenses = function (req, res) {
	if (!req.params && !req.params.userId) {
		sendJsonResponse(res, 404, {
			error: 'Invalid request'
		});
	}
	else{
		// find the user based on given id.
		users
			.findOne({email: req.params.userId})
			.select('expenses')
			.exec(function(err, user){
				if(!user) {
					sendJsonResponse(res, 404, {
						error: "No user found with given user id"
					});
					return;
				}
				if(err) {
					sendJsonResponse(res, 404, {
						error: err
					});
					return;
				}
				else {
					user.expenses.push({
						startDate: req.body.startDate,
						endDate: req.body.endDate,
						expense_sector: req.body.expense_sector,
						amount: req.body.amount
					});

					// save the change
					user.save(function(err, expenses) {
						if(err) {
							sendJsonResponse(res, 404, {
								error: err
							});
							return;
						}
						else{
							sendJsonResponse(res, 200, {
								success: true
							});
						}
					})
				}
			})
	}
}


/*
|----------------------------------------------
| show expense.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.showExpense = function (req, res) {
	if (!req.params && !req.params.userId) {
		sendJsonResponse(res, 404, {
			error: 'Invalid request'
		});
	}
	else{
		// get user expense object.
		users
			.findOne({email: req.params.userId})
			.select('expenses')
			.exec(function(err, user){
				if(!user) {
					sendJsonResponse(res, 404, {
						error: "No user found with given user id"
					});
					return;
				}
				if(err) {
					sendJsonResponse(res, 404, {
						error: err
					});
					return;
				}
				else{
					sendJsonResponse(res, 200, {
						success: true,
						expense: user.expenses
					});
				}
			})
	}
}

/*
|----------------------------------------------
| Following function will income to user collection
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccount, 2017
|----------------------------------------------
*/
module.exports.addIncome = function (req,res) {
	if(!req.params && !req.params.userId) {
		sendJsonResponse(res, 404, {
			error: 'invalid request',
		});
	}
	else {
		// check user against the user id
		users
		 	.findOne({email: req.params.userId})
		 	.select('incomes')
		 	.exec(function (err, user) {
		 		if(err) {
		 			sendJsonResponse(res, 404, {
		 				error: err,
		 			});
		 			return;
		 		}
		 		if (!user) {
		 			sendJsonResponse(res, 404, {
		 				error: 'no user found with given user id',
		 			});
		 			return;
		 		}
		 		else {
		 			// pusing income to incomes array.
		 			user.incomes.push({
		 				income: req.body.amount,
		 				incomeDate: req.body.incomeDate,
		 				incomeType: req.body.income_source
		 			});

		 			// now save the change.
		 			user.save(function (err, income) {
		 				sendJsonResponse(res, 200, {
		 					success: true,
		 					data: income
		 				});
		 			}) 
		 		}
		 	})
	}
}

/*
|----------------------------------------------
| Following function will show income for user
| based on given user id
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.showIncome = function (req, res) {
	if(!req.params && !req.params.userId) {
		sendJsonResponse(res, 404, {
			error: 'invalid request',
		});
	}
	else {
		users
		 	.findOne({email: req.params.userId})
		 	.select('incomes')
		 	.exec(function (err, user) {
		 		if(err) {
		 			sendJsonResponse(res, 404, {
		 				error: err,
		 			});
		 			return;
		 		}
		 		if (!user) {
		 			sendJsonResponse(res, 404, {
		 				error: 'no user found with given user id',
		 			});
		 			return;
		 		}
		 		else {
		 			sendJsonResponse(res, 200, {
		 				success: true,
		 				data: user.incomes
		 			});
		 		}
		 	})
	}
}

/*
|----------------------------------------------
| Following function will delete income based on
| given userId and incomeId
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.deleteIncome = function (req, res) {
	if(!req.params && !req.params.userId && !req.params.incomeId) {
		sendJsonResponse(res, 404, {
			error: 'invalid request',
		});
	}
	else{
		// find user incomes based on given user id
		users
			.findOne({email: req.params.userId})
			.select('incomes')
			.exec(function (err, user) {
					if(err) {
			 			sendJsonResponse(res, 404, {
			 				error: err,
			 			});
			 			return;
			 		}
			 		if (!user) {
			 			sendJsonResponse(res, 404, {
			 				error: 'no user found with given user id',
			 			});
			 			return;
			 		}
			 		else{
			 			// checking the lenth of the incomes to ensure we have incomes to delete
			 			if(user.incomes && user.incomes.length > 0) {
			 				// check the income id against all income ids from db
			 				if(!user.incomes.id(req.params.incomeId)) {
			 					sendJsonResponse(res, 404, {
			 						error: 'income does not match',
			 					});
			 					return;
			 				}
			 				else{
			 					// now delete and save change.
			 					user.incomes.id(req.params.incomeId).remove();
			 					user.save(function(err){
			 						if(err){
			 							sendJsonResponse(res, 404, {
			 								error: err,
			 							});
			 							return;
			 						}
			 						else{
			 							sendJsonResponse(res, 200, {
			 								success: true,
			 								data: 'income successfully deleted',
			 							});
			 						}
			 					})
			 				}
			 			}
			 			else{
			 				sendJsonResponse(res, 404, {
			 					error: 'no income to delete'
			 				});
			 				return;
			 			}
			 		}
			})
	}
}


/*
|----------------------------------------------
| Following method will show single income statement
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.showSingleIncome = function (req, res) {
	if(!req.params && !req.params.userId && !req.params.incomeId) {
		sendJsonResponse(res, 404, {
			error: 'invalid request',
		});
	}
	else{
		users
			.findOne({email: req.params.userId})
			.select('incomes')
			.exec(function (err, user) {
					if(err) {
			 			sendJsonResponse(res, 404, {
			 				error: err,
			 			});
			 			return;
			 		}
			 		if (!user) {
			 			sendJsonResponse(res, 404, {
			 				error: 'no user found with given user id',
			 			});
			 			return;
			 		}
			 		else{
			 			// checking the lenth of the incomes to ensure we have incomes to delete
			 			if(user.incomes && user.incomes.length > 0) {
			 				// check the income id against all income ids from db
			 				if(!user.incomes.id(req.params.incomeId)) {
			 					sendJsonResponse(res, 404, {
			 						error: 'income does not match',
			 					});
			 					return;
			 				}
			 				else{
			 					sendJsonResponse(res, 200, {
			 						success: true,
			 						data: user.incomes.id(req.params.incomeId)
			 					});
			 				}
			 			}
			 			else{
			 				sendJsonResponse(res, 404, {
			 					error: 'no income to show'
			 				});
			 				return;
			 			}
			 		}
			})
	}
}

/*
|----------------------------------------------
| Following method will update sinlge income
| based on given id
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccount, 2017
|----------------------------------------------
*/
module.exports.updateIncome = function (req, res) {
	if(!req.params && !req.params.userId && !req.params.incomeId) {
		sendJsonResponse(res, 404, {
			error: 'invalid request',
		});
	}
	else{
		users
			.findOne({email: req.params.userId})
			.select('incomes')
			.exec(function (err, user) {
					if(err) {
			 			sendJsonResponse(res, 404, {
			 				error: err,
			 			});
			 			return;
			 		}
			 		if (!user) {
			 			sendJsonResponse(res, 404, {
			 				error: 'no user found with given user id',
			 			});
			 			return;
			 		}
			 		else{
			 			// checking the lenth of the incomes to ensure we have incomes to delete
			 			if(user.incomes && user.incomes.length > 0) {
			 				var thisIncome = user.incomes.id(req.params.incomeId);

			 				if(!thisIncome) {
			 					sendJsonResponse(res, 404, {
			 						error: 'income id not found',
			 					});
			 					return;
			 				}
			 				else{
			 					thisIncome.income = req.body.amount;
			 					thisIncome.incomeType = req.body.income_source;
			 					thisIncome.incomeDate = req.body.incomeDate;
			 					// now save this change.
			 					user.save(function(err) {
			 						if(err) {
			 							sendJsonResponse(res, 404, {
			 								error: 'Error! while saving your updates',
			 							});
			 							return;
			 						}
			 						else{
			 							sendJsonResponse(res, 200, {
			 								success: true,
			 							});
			 						}
			 					})
			 				}
			 			}
			 			else{
			 				sendJsonResponse(res, 404, {
			 					error: 'no income to show'
			 				});
			 				return;
			 			}
			 		}
			})
	}
}

/*
|----------------------------------------------
| following function will add contact details
| based on given user email			
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.addContact = (req, res) => {
	if(!req.params && !req.params.userId) {
		sendJsonResponse(res, 404, {
			error: 'Invalid request',
		});
	}
	else{
		const userId = Joi.object().keys({
			userId: Joi.string().email().required(),
		});

		// console.log(Joi.validate(req.params, userId));
		Joi.validate(req.params, userId, (err, value) => {
			if (err) {
				sendJsonResponse(res, 404, {
					error: err,
				});
			}
			else{
				// find user with user id.
				users
					.findOne({email: req.params.userId})
					.select('contact')
					.exec((err, user) => {
						if (err) {
							sendJsonResponse(res, 404, {
								error: err,
							});
							return;
						}
						if (!user) {
							sendJsonResponse(res, 404, {
								error: 'no user found with given user id',
							});
							return;
						}
						// now we need validate our contact data passed from the form
						const contact = Joi.object().keys({
							mobile: Joi.string().min(11).max(11).regex(/^[0-9]+/).required(),
							landline: Joi.string().min(11).max(11),
						});
						Joi.validate(req.body, contact, (err, value) => {
							if (err) {
								sendJsonResponse(res, 404, {
									error: err,
								});
								return;
							}
							else{
								user.contact.push({
									mobile: req.body.mobile,
									landLine: req.body.landline,
								});
								// now saving the change
								user.save((err, user) => {
									if (err) {
										sendJsonResponse(res, 404, {
											error: err,
										});
										return;
									}
									else{
										sendJsonResponse(res, 200, {
											success: true,
											data: user.contact,
										});
									}
								});
							}
						})
					});
			}
		})
	}
}


/*
|----------------------------------------------
| Following method will show user contact 
| based on user id
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccount, 2017
|----------------------------------------------
*/
module.exports.showContact = (req, res) => {
	Joi.validate(req.params, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err,
			});
			return;
		}
		else{
			users
				.findOne({email: req.params.userId})
				.select('contact')
				.exec((err, user) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					if (!user) {
						sendJsonResponse(res, 404, {
							error: 'user not found',
						});
						return;
					}
					sendJsonResponse(res, 200, {
						success: false,
						data: user.contact,
					});
				})
		}
	})
}


/*
|----------------------------------------------
| Following function will add  business info
| according to given user id
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.addBusinessInfo = (req, res) => {
	Joi.validate(req.params, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err,
			});
		}
		else {
			users
				.findOne({email: req.params.userId})
				.select('business')
				.exec((err, user) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					if (!user) {
						sendJsonResponse(res, 404, {
							error: 'no user found',
						});
						return;
					}
					// to validate form data.
					const businessInfo = Joi.object().keys({
						name: Joi.string().min(3).max(25).required(),
						type: Joi.string().min(3).max(25).required(),
					});

					// checking validation.
					Joi.validate(req.body, businessInfo, (err, value) => {
						if (err) {
							sendJsonResponse(res, 404, {
								error: err,
							});
							return;
						}
						else{
							user.business.push({
								name: req.body.name,
								type: req.body.type,
							});

							// now saving changes
							user.save((err, user) => {
								if (err) {
									sendJsonResponse(res, 404, {
										error: 'Error! while saving',
									});
									return;
								}
								else{
									sendJsonResponse(res, 200, {
										success: true,
										data: user.business,
									});
								}
							})
						}
					})
				})
		}
	});
}

/*
|----------------------------------------------
| Following function will show basic business info
| based on given user id
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccount, 2017
|----------------------------------------------
*/
module.exports.showBusinessInfo = (req, res) => {
	Joi.validate(req.params, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err,
			});
			return;
		}
		else{
			users
				.findOne({email: req.params.userId})
				.select('business')
				.exec((err, user) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					if (!user) {
						sendJsonResponse(res, 404, {
							error: 'user not found',
						});
						return;
					}
					sendJsonResponse(res, 200, {
						success: true,
						data: user.business,
					});
				})
		}
	})
}

/*
|----------------------------------------------
| Following function will add vehicle to user
| according to userid
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.addVehicle = (req, res) => {
	Joi.validate(req.userId, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err,
			});
			return;
		}
		else {
			const vehicle = Joi.object().keys({
				type: Joi.string().min(3).required(),
				brand: Joi.string().min(3).required(),
				registration: Joi.string().min(5).required(),
				car_value: Joi.number().min(3).required(),
				mot: Joi.date().iso().required(),
				roadtax: Joi.date().iso().required(),
				car_status: Joi.string().min(3).required(),
			});

			// validate form data.
			Joi.validate(req.body, vehicle, (err, value) => {
				if (err) {
					sendJsonResponse(res, 404, {
						error: err,
					})
					return;
				}
				else{
					users 
						.findOne({email: req.params.userId})
						.select('vehicle')
						.exec((err, user) => {
							if (err) {
								sendJsonResponse(res, 404, {
									error: err,
								});
								return;
							}
							if (!user) {
								sendJsonResponse(res, 404, {
									error: 'no user found',
								});
								return;
							}
							user.vehicle.push({
								car_type: req.body.type,
								brand: req.body.brand,
								rg_number: req.body.registration,
								car_value: req.body.car_value,
								mot: req.body.mot,
								road_tax: req.body.roadtax,
								car_status: req.body.car_status,
							});

							user.save((err, user) => {
								if (err) {
									sendJsonResponse(res, 404, {
										error: 'Error! while saving',
									});
									return;
								}
								else{
									sendJsonResponse(res, 200, {
										success: true,
										data: user.vehicle,
									});
								}
							})
						})
				}
			})
		}
	});
}


/*
|----------------------------------------------
| following function will show vehicle details
| based on given user id
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.showVehicle = (req, res) => {
	Joi.validate(req.userId, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err,
			});
			return;
		}
		else{
			users
				.findOne({email: req.params.userId})
				.select('vehicle')
				.exec((err, user) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					if (!user) {
						sendJsonResponse(res, 404, {
							error: 'user not found',
						});
						return;
					}
					sendJsonResponse(res, 200, {
						success: true,
						data: user.vehicle,
					});
				})
		}
	});
}

/*
|----------------------------------------------
| Following method will add insurance details 
| for the given user based on given id.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.addInsurance = (req, res) => {
	Joi.validate(req.params, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err,
			});
			return;
		}
		else{
			const insurance = Joi.object().keys({
				name: Joi.string().min(3).required(),
				valid_date: Joi.date().iso().required(),
				number: Joi.string().min(3),
			});

			Joi.validate(req.body, insurance, (err, value) => {
				if (err) {
					sendJsonResponse(res, 404, {
						error: err,
					});
					return;
				}
				else{
					users 
						.findOne({email: req.params.userId})
						.select('insurance')
						.exec((err, user) => {
							if (err) {
								sendJsonResponse(res, 404, {
									error: err,
								});
								return;
							}
							if (!user) {
								sendJsonResponse(res, 404, {
									error: 'No user has been found according to given id',
								});
								return;
							}
							user.insurance.push({
								provider_name: req.body.name,
								valid_till: req.body.valid_date,
								insurance_number: req.body.number,
							});

							user.save((err, user) => {
								if (err) {
									sendJsonResponse(res, 404, {
										error: 'Error! while saving the insurance info',
									});
									return;
								}
								else{
									sendJsonResponse(res, 200, {
										success: true,
										data: user.insurance,
									});
								}
							})
						})
				}
			})
		}
	})
}

/*
|----------------------------------------------
| Following method will show insurance details 
| based on given user id
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccount, 2017
|----------------------------------------------
*/
module.exports.showInsurance = (req, res) => {
	Joi.validate(req.params, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err,
			});
			return;
		}
		else{
			users
				.findOne({email: req.params.userId})
				.select('insurance')
				.exec((err, user) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					if (!user) {
						sendJsonResponse(res, 404, {
							error: 'No user found for given user email',
						});
						return;
					}
					sendJsonResponse(res, 200, {
						success: true,
						insurance: user.insurance,
					});
				})
		}
	});
}

/*
|----------------------------------------------
| Following function will add lisence information
| to user collection based on given id.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting, 2017
|----------------------------------------------
*/
module.exports.addLisence = (req, res) => {
	Joi.validate(req.params, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err,
			});
			return;
		}
		else {
			const lisence = Joi.object().keys({
				dvla: Joi.string().min(5).max(16).regex(/^[0-9]{5,16}$/).required(),
				taxi_type: Joi.string().max(32).required(),
				valid_till: Joi.date().required(),
			});

			Joi.validate(req.body, lisence, (err, value) => {
				if (err) {
					sendJsonResponse(res, 404, {
						error: err,
					});
					return;
				}
				else{
					users
						.findOne({email: req.params.userId})
						.select('lisence')
						.exec((err, user) => {
							if (err) {
								sendJsonResponse(res, 404, {
									error: err,
								});
								return;
							}
							if (!user) {
								sendJsonResponse(res, 404, {
									error: 'no user found',
								});
								return;
							}
							else {
								user.lisence.push({
									dvla: req.body.dvla,
									taxi: req.body.taxi_type,
									valid_till: req.body.valid_till,
								});

								user.save((err, user) => {
									if (err) {
										sendJsonResponse(res, 404, {
											error: 'Error! while saving lisence information',
										});
										return;
									}
									else{
										sendJsonResponse(res, 200, {
											success: true,
											lisence: user.lisence,
										});
									}
								})

							}
						})
				}
			})
		}
	})
}


/*
|----------------------------------------------
| following method will get user lisence info
| based on given userid
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccount, 2017
|----------------------------------------------
*/

module.exports.showLisence = (req, res) => {
	Joi.validate(req.params, userId, (err, value) => {
		if (err) {
			sendJsonResponse(res, 404, {
				error: err,
			});
			return;
		}
		else {
			users
				.findOne({email: req.params.userId})
				.select('lisence')
				.exec((err, user) => {
					if (err) {
						sendJsonResponse(res, 404, {
							error: err,
						});
						return;
					}
					if (!user) {
						sendJsonResponse(res, 404, {
							error: `No user found with given user name`,
						});
						return;
					}
					else {
						return sendJsonResponse(res, 200, {
							lisence: user.lisence,
						});
					}
				})
		}
	});
}




