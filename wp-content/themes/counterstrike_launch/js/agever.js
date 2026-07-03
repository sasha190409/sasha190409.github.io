	// cookie functions

	function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
	}

	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	function eraseCookie(name) {
		createCookie(name,"",-1);
	}

	// display functions

	function hideForm(){
	 	$j('.ageform').hide();
	}


	function showVideo(){
	    // show general videos protected by age gate wrapper
	    $j('.overlay').css('display', 'none');
	}

	function showError(){	
	    $j('.ageGate').append('<div class="age_gate_error" class="gated">Sorry you are not allowed to view this video</div>');
	}

	function createForm(){
		// month select
		var monthSelector = '';
		monthSelector += '<select class="monthSelect" name="monthSelect">';
		monthSelector += '<option value="1">January</option>';
		monthSelector += '<option value="2">February</option>';
		monthSelector += '<option value="3">March</option>';
		monthSelector += '<option value="4">April</option>';
		monthSelector += '<option value="5">May</option>';
		monthSelector += '<option value="6">June</option>';
		monthSelector += '<option value="7">July</option>';
		monthSelector += '<option value="8">August</option>';
		monthSelector += '<option value="9">September</option>';
		monthSelector += '<option value="10">October</option>';
		monthSelector += '<option value="11">November</option>';
		monthSelector += '<option value="12">December</option>';
		monthSelector += '</select>';
		
		// date select
		var dateSelect = '<select class="dateSelect" name="dateSelect">';
		for(var d=1; d <= 31; d++){
			dateSelect += '<option value="' + d + '">' + d + '</option>';
		}
		dateSelect += '</select>'		
		
		// year select
		date = new Date();
		year = date.getFullYear(); 
		var yearSelect = '<select class="yearSelect" name="yearSelect">';
		for(var y=year; y > 1900; y--){
			yearSelect += '<option value="' + y + '">' + y + '</option>';
		}
		yearSelect = yearSelect + '</select>'	

		// submit
		submitButton = '<button class="submitBirthDate">Enter</button>';

		// form creation
		var form = '<div class="ageform"><div class="formCopy">Please enter your birth date to continue:</div>' + dateSelect + monthSelector + yearSelect + submitButton + '</div>';
		//$j('#ageform').append(form);
		$j('.ageGate').append(form);

	}

	// check for cookie and display content

	$j(document).ready(function() {
		
		createForm();

		$j('.submitBirthDate').click(function() {
						
			var today = new Date();
			
			var birthDay = $j(this).parent('.ageform').children('.dateSelect').val();
			var birthMonth = $j(this).parent('.ageform').children('.monthSelect').val() -1; // offset to match month array
			var birthYear = $j(this).parent('.ageform').children('.yearSelect').val();

			var birthDate = new Date(birthYear,  birthMonth, birthDay);

			var userAge = today.getFullYear() - birthYear;
			if( today.getMonth() < birthMonth || ( today.getMonth() == birthMonth && today.getDate() < birthDay ) ){
				userAge--;
			}
			
			if( userAge >= 17 ){
				createCookie('cs_agever', 1, 365);
				hideForm();
				showVideo();
			}
			else if(userAge < 17 && userAge > 0){
				createCookie('cs_agever', 2, 365);
				hideForm();
				showError();
			}
			if( userAge == 0){
				alert('Please enter your birth date');
			}
			
		});

		var CookieAge = readCookie('cs_agever');

		if (CookieAge == 1) {
		  // add video
		  hideForm();
		  showVideo();
		}
		if (CookieAge == 2) {
		  // no video
		  hideForm();
		  showError();
		}
	 });

	 