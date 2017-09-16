/*
|----------------------------------------------
| setting up user controller 
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxi, 2017
|----------------------------------------------
*/
var 		mongoose 		=		require('mongoose'),
			users 			=		mongoose.model('users');


var 		sendJsonResponse 	=	function(res, status, content){
	res.status(status);
	res.json(content);
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
					// add expense to user collections.
					user.expenses.push(req.body);
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
							console.log(expenses);
						}
					})
				}
			})
	}
}


