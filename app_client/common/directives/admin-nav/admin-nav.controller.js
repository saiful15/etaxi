/*
|----------------------------------------------
| setting up admin nav controller
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxi, 2018
|----------------------------------------------
*/

'use strict';

(function() {
    angular
        .module('etaxi')
        .controller('adminNavCtrl', adminNavCtrl);

    // add dependency
    adminNavCtrl.$inject = ['$location', 'authentication', 'userservice'];

    function adminNavCtrl($location, authentication, userservice) {
        const adnvm = this;
        adnvm.loggedIn = authentication.isLoggedIn()
        adnvm.logout = function() {
                authentication.logout();
                $location.path('/signin');
            }
            // checking whether user logged in 
        if (authentication.isLoggedIn()) {
            adnvm.forLoggedInUser = true;
            adnvm.accountType = authentication.currentUser().account_type;
            adnvm.name = authentication.currentUser().name;
        }
        angular.element(document).ready(function() {

            $("nav a.sidebar-toggle").click(function(e) {
                e.preventDefault();
                //Enable sidebar push menu
                const body = jQuery("#admin-body");
                if (!body.hasClass('sidebar-collapse') && !body.hasClass('sidebar-open')) {
                    body.addClass('sidebar-collapse');
                    body.addClass('sidebar-mini');
                } else {
                    if (body.hasClass('sidebar-open')) {
                        body.removeClass('sidebar-open');
                        body.addClass('sidebar-mini');
                        body.addClass('sidebar-collapse');
                    } else {
                        body.removeClass('sidebar-mini');
                        body.removeClass('sidebar-collapse');
                        body.addClass('sidebar-open');
                    }
                }

            });

        });
    }
})();