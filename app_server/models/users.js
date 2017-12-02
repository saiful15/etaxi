/*
|----------------------------------------------------------------
| Setting up user model.
|----------------------------------------------------------------
*/
var 			mongoose			=	require('mongoose')
				jwt 				=	require('jsonwebtoken'),
				crypto 			=	require('crypto');

 

var 			profileSchema 	=	new mongoose.Schema({
	created_at: {type: Date},
	first_name: {type: String},
	last_name: {type: String},
	// address: [addressSchema]
})

const bisinssContactSchema = new mongoose.Schema({
	business_email: {type: String},
	business_mobile: {type: String},
	business_tel: {type: String},
	created_at: {type: Date, "default": Date.now}
});

var 			contactSchema 	=	new mongoose.Schema({
	mobile: {type: String},
	landLine: {type: String},
	businessContact: [bisinssContactSchema],
	created_at: {type: Date, "default": Date.now}
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
	created_at: {type: Date, default: Date.now}
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
	additional_info: {type: Boolean, required: true, default: false},
	lisence: {type: Boolean, required: true, default: false}
});


const incomeSchema = new mongoose.Schema({
	incomeDate: { type: String, default: Date.now },
	income: { type: Number, required: true, min: 1},
	incomeType: {type: String, required: true },
})

const appContactSchema = new mongoose.Schema({
	contactEmail: {type: String, default: 'taxiadmin@taxiaccounting.co.uk'},
});

var 			userSchema 		=	new mongoose.Schema({
	email: {type: String, required: true, unique: true},
	userId: {type: String, required: true, unique: true },
	userDir: {type: String, required: true, },
	hash: {type: String},
	salt: {type: String},
	status: {type: String},
	statusCollection: [statusSchema],
	appContact: [appContactSchema],
	account_type: {type: String},
	created_at: {type: Date, default: Date.now},
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
		userId: this.userId,
		exp: parseInt(expiry.getTime() / 1000 ),
	}, process.env.jswntokenkey);
}


var 			collectionName 	=	"users";


// registering shcema with mongoose.
mongoose.model('users', userSchema, collectionName);
