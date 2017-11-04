/*
|----------------------------------------------------------------
| Setting up user model.
|----------------------------------------------------------------
*/
var 			mongoose			=	require('mongoose');


var incomeSchema = new mongoose.Schema({
	incomeId: {type: String, required: true },
	whos: {type: String, required: true },
	incomeDate: { type: String, default: Date.now },
	income: { type: Number, required: true, min: 1},
	incomeType: {type: String, required: true },
	createdAt: {type: Date, default: Date.now },
});


var 			collectionName 	=	"incomes";


// registering shcema with mongoose.
mongoose.model('incomes', incomeSchema, collectionName);
