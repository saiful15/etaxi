/*
|----------------------------------------------------------------
| Setting up user model.
|----------------------------------------------------------------
*/
var 			mongoose			=	require('mongoose')
				jwt 				=	require('jsonwebtoken'),
				crypto 				=	require('crypto');

var 		addressSchema 		=	new mongoose.Schema({
	county: {type: String},
	city_name: {type: String},
	postcode: {type: String},
	street_name: {type: String},
	house_number: {type: Number},
}) 

var 			profileSchema 	=	new mongoose.Schema({
	created_at: {type: Date},
	first_name: {type: String},
	last_name: {type: String},
	address: [addressSchema]
})

var 			contactSchema 	=	new mongoose.Schema({
	mobile: {type: String},
	landLine: {type: String},
	businessContact: {type: Boolean},
	business_email: {type: String},
	business_mobile: {type: String},
	business_tel: {type: String},
	created_at: {type: Date}
});

var 	businessAddressSchema 	=	new mongoose.Schema({
	house_no: {type: Number},
	street_name: {type: String},
	city: {type: String},
	county: {type: String},
	postcode: {type: String},
	businessAddress: {type: Boolean},
	created_at: {type: Date}
})

var 	businessSchema 			=	new mongoose.Schema({
	name: {type: String},
	type: {type: String},
	created_at: {type: Date}
});

var 			lisenceSchema 	=	new mongoose.Schema({
	dvla: {type: Number},
	taxi: {type: Array},
	created_at: {type: Date}
});

var 			vehicleSchema 	=	new mongoose.Schema({
	car_type: {type: String},
	brand: {type: String},
	rg_number: {type: String},
	car_value: {type: Number},
	mot: {type: Date},
	road_tax: {type: Date},
	car_status: {type: String},
	created_at: {type: Date}
});


var 		additional_infoSchema 	=	new mongoose.Schema({
	ni_number: {type: String},
	uti_number: {type: String},
	created_at: {type: Date}
});

var 		insuranceSchema 	=	new mongoose.Schema({
	provider_name: {type: String},
	valid_till: {type: Date},
	insurance_number: {type: String},
	created_at: {type: Date}
});


var 			statusSchema 	=	new mongoose.Schema({
	profile: {type: Boolean, required: true, default: false},
	contact: {type: Boolean, required: true, default: false},
	address: {type: Boolean, required: true, default: false},
	business: {type: Boolean, required: true, default: false},
	vehicle: {type: Boolean, required: true, default: false},
	insurance: {type: Boolean, required: true, default: false},
	Income: {type: Boolean, required: true, default: false},
	expense: {type: Boolean, required: true, default: false},
	additional_info: {type: Boolean, required: true, default: false}
});

var expenseSchema = new mongoose.Schema({
	startDate: { type: Date},
	endDate: { type: Date },
	expense_sector: {type: String, required: true },
	amount: {type: Number, required: true, min: 0 },
	createdAt: { type: Date, "default": Date.now }
});

const incomeSchema = new mongoose.Schema({
	incomeDate: { type: Date, default: Date.now },
	income: { type: Number, required: true, min: 1},
	incomeType: {type: String, required: true },
})

var 			userSchema 		=	new mongoose.Schema({
	email: {type: String, required: true, unique: true},
	hash: {type: String},
	salt: {type: String},
	status: {type: String},
	account_type: {type: String},
	created_at: {type: Date, default: Date.now},
	profile: [profileSchema],
	contact: [contactSchema],
	businessAddress: [businessAddressSchema],
	business: [businessSchema],
	lisence: [lisenceSchema],
	vehicle: [vehicleSchema],
	additional_info: [additional_infoSchema],
	insurance: [insuranceSchema],
	statusCollection: [statusSchema],
	history: {type: Array},
	expenses: [expenseSchema],
	incomes: [incomeSchema],
});


/*
|----------------------------------------------------------------
| encrypt password.
|----------------------------------------------------------------
*/
userSchema.methods.setPassword	=	function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
}

/*
|----------------------------------------------------------------
| Setting up method to validate password.
|----------------------------------------------------------------
*/
userSchema.methods.validatePassword 	= function(password){
	var 	hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
	return this.hash === hash;
}

/*
|----------------------------------------------------------------
| setting up jsonwebtoken.
|----------------------------------------------------------------
*/
userSchema.methods.generateJwt 	=	function(){

	// setting expiry date.
	var 	expiry 	=	new Date();
		expiry.setDate(expiry.getDate() + 14);

	// return jsonwebtoken.
	// return jwt.
	return jwt.sign({
		_id: this._id,
		email: this.email,
		name: this.name,
		account_type: this.account_type,
		exp: parseInt(expiry.getTime() / 1000 ),
	}, process.env.jswntokenkey);
}


var 			collectionName 	=	"users";


// registering shcema with mongoose.
mongoose.model('users', userSchema, collectionName);
