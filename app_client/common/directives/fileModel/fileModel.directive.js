/*
|----------------------------------------------
| setting up file upload directive
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: nclhalal, 2017
|----------------------------------------------
*/
(function(){
	angular
		.module('etaxi')
		.directive('fileModel', fileModel);

	fileModel.$inject = ['$parse'];

	function fileModel($parse){
		return {
			restrict: 'A',
	        link: function(scope, element, attrs) {
	            var parsedFile = $parse(attrs.fileModel);
	            var parsedFileSetter = parsedFile.assign;

	            element.bind('change', function(){
	                scope.$apply(function(){
	                    parsedFileSetter(scope, element[0].files[0]);
	                });
	            });
	        }
		}
	}
})();
