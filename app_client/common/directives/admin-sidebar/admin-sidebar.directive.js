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
        .directive('adminSidebar', adminSidebar);

    function adminSidebar() {
        return {
            restrict: 'EA',
            templateUrl: "common/directives/admin-sidebar/admin-sidebar.template.html",
            controller: "adminSidebarCtrl as asbvm"
        }
    }
})();