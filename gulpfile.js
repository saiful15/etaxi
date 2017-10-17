/*
|-----------------------------------------------------
| Setting up gulpfile
|-----------------------------------------------------
*/
var     gulp        =       require('gulp'),
        sass        =       require('gulp-sass'),
        concat      =       require('gulp-concat'),
        babel 		=		require('gulp-babel'),
        uglifyjs  	=       require('gulp-uglify'),
        es2015 		= 		require('babel-preset-es2015'),
        notify      =       require('gulp-notify'),
        sourcemaps  =       require('gulp-sourcemaps');



var     paths       =       {
    scripts: [
        "public/libs/angular.js",
        "public/libs/angular-resource.js",
        "public/libs/angular-route.js",
        "public/libs/jquery.js",
        "public/libs/bootstrap.js"
    ],
    clientFiles: [
    	"app_client/app.js",
        "app_client/common/services/authentication/authentication.js",
        "app_client/common/services/user/user.service.js",
        "app_client/common/services/authentication/account.service.js",
    	"app_client/common/directives/navigation/navigation.directive.js",
        "app_client/common/directives/navigation/navigation.controller.js",
        "app_client/common/directives/site-footer/sitefooter.directive.js",
    	"app_client/home/home.controller.js",
    	"app_client/services/services.controller.js",
    	"app_client/price/price.controller.js",
    	"app_client/contactus/contactus.controller.js",
    	"app_client/signup/signup.controller.js",
    	"app_client/signin/signin.controller.js",
        "app_client/forgotpassword/forgotpassword.controller.js",
        "app_client/profile/profile.controller.js",
        "app_client/dashboard/dashboard.controller.js",
        "app_client/dashboard/businessprofile/businessprofile.controller.js",
        "app_client/dashboard/serviceplan/serviceplan.controller.js",
        "app_client/dashboard/income/income.controller.js",
        "app_client/dashboard/allincomestatements/allincomestatements.controller.js",
        "app_client/dashboard/expense/expense.controller.js",
        "app_client/dashboard/financialstatement/financialstatement.controller.js",
        "app_client/dashboard/settings/settings.controller.js"

    ],
    styles: [
        "public/sass/app.scss"
    ]
};




//gulp task to compile js files.
gulp.task('compile-js', function(){    
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        	.pipe(babel({presets: ['es2015']}).on('error', reportError ))
        	.pipe(uglifyjs())
            .pipe(concat('master.min.js'))
        .pipe(sourcemaps.write())
        .pipe(notify('js compiled'))
        .pipe(gulp.dest("./public/js/"));
});

//gulp task to compile js files.
gulp.task('compile-clients', function(){    
    return gulp.src(paths.clientFiles)
        .pipe(sourcemaps.init())
        	.pipe(babel({presets: ['es2015']}).on('error', reportError ))
        	.pipe(uglifyjs())
            .pipe(concat('app.min.js'))
        .pipe(sourcemaps.write())
        .pipe(notify('client files compiled'))
        .pipe(gulp.dest("./public/js/"));
});


//gulp task to compile sass files.
gulp.task('compile-sass', function(){    
    return gulp.src(paths.styles)
        .pipe(sourcemaps.init())
            .pipe(sass().on('error', reportError ))
            .pipe(concat('app.min.css'))
        .pipe(sourcemaps.write())
        .pipe(notify('sass compiled'))
        .pipe(gulp.dest("./public/css/"));
});

function reportError (error) {
    notify({
        title: 'Gulp Task Error',
        message: 'Check the console.'
    }).write(error);

    console.log(error.toString());
    this.emit('end');
}

//gulp-task to keep on watching all files.
gulp.task('watch', function(){
    gulp.watch(paths.scripts, ['compile-js']);
    gulp.watch(paths.clientFiles, ['compile-clients']);
    gulp.watch("public/sass/*.scss", ['compile-sass']);
});


//calling gulp task to run as default function.
gulp.task('default', ['watch', 'compile-js', 'compile-sass', 'compile-clients']);
