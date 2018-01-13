require('dotenv').load();
/*
|----------------------------------------------
| setting up server entry point for the app
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxiaccounting, 2017
|----------------------------------------------
*/
var 		express 		=		require('express'),
			bodyParser 		=		require('body-parser'),
			path 			=		require('path'),
			passport 		=		require('passport'),
			morgan 			=		require('morgan');

// require database connection.
require("./app_server/models/db");
// require passport config
require("./app_server/config/passport");

// express object. 
const app = express();

// general app setting.
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// static resource
app.use(express.static(__dirname + path.join("/public")));
app.use(express.static(__dirname + path.join("/app_client")));
app.use(express.static(__dirname + path.join("/users")));

/*
|----------------------------------------------
| setting up back-route
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxiaccounting, 2017
|----------------------------------------------
*/
const apiRoutes 		=		require("./app_server/routes/index");


// initalize passport.
app.use(passport.initialize());

app.use('/api', apiRoutes);


// load index view for all route.
app.use(function(req, res){
	res.sendFile(path.join(__dirname + "/app_client", "index.html"));
});


// starting the server.
app.listen(process.env.port, function(){
	console.log('app started on port \t'+process.env.port);
});
