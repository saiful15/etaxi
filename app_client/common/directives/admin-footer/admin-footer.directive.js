/*
|----------------------------------------------
| setting up admin sidebar directive
| @author: saiful alam <saiful.alam15@gmail.com>
| @copyright: etaxi, 2018
|----------------------------------------------
*/
(function() {
    angular
        .module('etaxi')
        .directive('adminFooter', adminFooter);

    function adminFooter() {
        return {
            restrict: 'EA',
            templateUrl: "common/directives/admin-footer/admin-footer.template.html"
        };
    }
})();