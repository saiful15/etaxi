/*
|----------------------------------------------
| setting up admin sidebar directive
| @author: saiful alam <saiful.alam15@gmail.com>
| @copyright: etaxi, 2018
|----------------------------------------------
*/

'use strict';

(function() {
    angular
        .module('etaxi')
        .controller('adminSidebarCtrl', adminSidebarCtrl);

    // add dependency
    adminSidebarCtrl.$inject = ['$location', 'authentication', 'userservice'];

    function adminSidebarCtrl($location, authentication, userservice) {
        const asbvm = this;

        asbvm.loggedIn = authentication.isLoggedIn()

        asbvm.logout = function() {
            authentication.logout();
            $location.path('/signin');
        }

        // checking whether user logged in 
        if (authentication.isLoggedIn()) {
            asbvm.forLoggedInUser = true;
            asbvm.accountType = authentication.currentUser().account_type;
            asbvm.name = authentication.currentUser().name;

        }
    }
})();