/*
|----------------------------------------------
| setting up home controller
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: etaxiaccounting, 2017
|----------------------------------------------
*/
(function(){
	angular
		.module('etaxi')
		.controller('homeCtrl', homeCtrl);

	function homeCtrl(){
		const 	hmvm 		=	this;
		angular.element(document).ready(function() {
			App.init();
         App.initParallaxBg();
         FancyBox.initFancybox();
         OwlCarousel.initOwlCarousel();
         StyleSwitcher.initStyleSwitcher();
         RevolutionSlider.initRSfullWidth();
		});
	}
})();