/*
|----------------------------------------------
| setting up directive for etaxi app
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxiaccounting, 2017
|----------------------------------------------
*/
(function() {
    angular
        .module('etaxi')
        .directive('siteNav', siteNav);

    function siteNav() {
        return {
            restrict: 'EA',
            templateUrl: "common/directives/navigation/navigation.template.html",
            controller: "navCtrl as nvm"
        }
    }
})();