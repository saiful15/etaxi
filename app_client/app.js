/*
|----------------------------------------------
| angular entry point for the application
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxiaccounting, 2017
|----------------------------------------------
*/
(function(){
	angular
		.module('etaxi', ['ngResource', 'ngRoute'])
		.config(['$routeProvider', '$locationProvider', config]);

	function config($routeProvider, $locationProvider){
		$routeProvider
			.when('/', {
				templateUrl: "home/home.view.html",
				controller: 'homeCtrl',
				controllerAs: 'hmvm'
			})
			.when('/services', {
				templateUrl: "services/services.view.html",
				controller: 'servicesCtrl',
				controllerAs: 'srvm'
			})
			.when('/price', {
				templateUrl: "price/price.view.html",
				controller: 'priceCtrl',
				controllerAs: 'prvm'
			})
			.when('/aboutus', {
				templateUrl: "aboutus/aboutus.view.html"
			})
			.when("/contactus", {
				templateUrl: "contactus/contactus.view.html",
				controller: 'contactusCtrl',
				controllerAs: 'ctvm'
			})
			.when("/signup", {
				templateUrl: "signup/signup.view.html",
				controller: 'signCtrl',
				controllerAs: 'sgnvm'
			})
			.when("/signin", {
				templateUrl: "signin/signin.view.html",
				controller: 'signinCtrl',
				controllerAs: 'lgvm'
			})
			.when("/dashboard", {
				templateUrl: "dashboard/dashboard.view.html",
				controller: 'dashboardCtrl',
				controllerAs: 'dsvm'
			})
			.when('/businessprofile', {
				templateUrl: "dashboard/businessprofile/businessprofile.view.html",
				controller: 'businessProfileCtrl',
				controllerAs: 'bsvm'
			})
			.when('/serviceplan', {
				templateUrl: "dashboard/serviceplan/serviceplan.view.html",
				controller: 'servicePlanCtrl',
				controllerAs: 'srvm'
			})
			.when('/income', {
				templateUrl: "dashboard/income/income.view.html",
				controller: "incomeCtrl",
				controllerAs: 'invm'
			})
			.when('/expense', {
				templateUrl: "dashboard/expense/expense.view.html",
				controller: "expenseCtrl",
				controllerAs: 'exvm'
			})
			.when('/financialstatement', {
				templateUrl: "dashboard/financialstatement/financialstatement.view.html",
				controller: "financialstatementCtrl",
				controllers: 'fsvm'
			})
			.when('/settings', {
				templateUrl: "dashboard/settings/settings.view.html",
				controller: 'settingsCtrl',
				controllerAs: 'stvm'
			})
			.when('/profile', {
				templateUrl: "profile/profile.view.html",
				controller: "profileCtrl",
				controllerAs: "prvm"
			})

		// enable html5 mode
		$locationProvider.html5Mode({
			enabled: true
		});
	}
})();