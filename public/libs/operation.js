/*
|----------------------------------------------
| setting up jquery functions for the application.
| @author: jahid haque <jahid.haque@yahoo.com>
| @copyright: taxiaccounting., 2017
|----------------------------------------------
*/
'use strict';
(function (){
	$(document).ready(() => {

		// address radio option.
		$(document).on('click', "[data-js='addressOptionRadio']", function(){
			if ($(this).val() === 'false') {
				$('#businessAddress').removeClass('hidden');
			}
			else if($(this).val() === 'true') {
				$('#businessAddress').addClass('hidden');
			}
		});

		$(document).on('click', "[data-js='showBuss']", function(){
			$(this).find('i').toggleClass('fa-eye').toggleClass('fa-eye-slash');
			$("#showBusinessAddress").toggleClass('hidden');
		});
	});
})();
