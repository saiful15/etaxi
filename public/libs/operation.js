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

		$(".profile-control-list li").first().addClass('active');

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

		$(document).on('click', "[data-js-app]", function(){
			const val = $(this).attr('data-js-app');
			if ($('.usermanagement').attr('data-js-opr') === val) {
				$('.usermanagement').toggleClass('hidden');
				$('.accountant-management').addClass('hidden');
			}
			else if ($('.accountant-management').attr('data-js-opr') === val) {
				$('.accountant-management').toggleClass('hidden');
				$('.usermanagement').addClass('hidden');
			}
		});

		$(document).on('click', "[data-js='usersearch']", () => {
			$("[data-js='usercount']").addClass('hidden');
			$("#searchform").toggleClass('hidden');
		});

		

	});
})();
