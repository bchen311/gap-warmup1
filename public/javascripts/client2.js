
/* Takes a dictionary to be JSON encoded, calls the success
   function with the diction decoded from the JSON response.*/
function json_request(page, dict, success, failure) {
    $.ajax({
        type: 'POST',
        url: page,
        data: JSON.stringify(dict),
        contentType: "application/json",
        dataType: "json",
        success: success,
        failure: failure
    });
}

debug_flag = false;

ERR_BAD_CREDENTIALS = (-1);
ERR_USER_EXISTS = (-2);
ERR_BAD_USERNAME = (-3);



function get_message_for_errcode(code) {
    /* "Invalid username and password combination. Please try again. " (ERR_BAD_CREDENTIALS)
       "The user name should not be empty. Please try again." (ERR_BAD_USERNAME)
       "This user name already exists. Please try again." (ERR_USER_EXISTS)
    */

    if( code == ERR_BAD_CREDENTIALS) {
        return ("Invalid username and password combination. Please try again. ");
    } else if( code == ERR_BAD_USERNAME) {
        return ("The user name should not be empty. Please try again.");
    } else if( code == ERR_USER_EXISTS) {
        return ("This user name already exists. Please try again.");
    } else {
        // This case should never happen!
        if( debug_flag ) { alert('Illegal error code encountered: ' + code); }
        return ("Unknown error occured: " + code);
   }
}

$('#login-page').hide()
$('#welcome-page').hide()
$('#login-username').val("")
$('#login-password').val("")
$('#login-message').html("Please enter your credentials below")
$('#welcome-message').html("You should never see this text");


/* setup the page so that only one of the forms is shown */
$(document).ready(function() {
   show_login_page();
   $('#login-button').click(function() {
     console.log('test2')
     alert('test')
     username = $('#login-username').val()
     password = $('#login-password').val()
     json_request("/users/login", { user: username, password: password }, function(data) { return handle_login_response(data, username); }, function(err) { alert('error occurred on request'); });

     return false;
   });

   $('#add-user-button').click(function() {
     username = $('#login-username').val()
     password = $('#login-password').val()
     json_request("/users/add", { user: username, password: password }, function(data) { return handle_add_user_response(data, username); }, function(err) {alert('error occurred on request'); });

     return false;
   });
});

/* Note: These two functions are deliberately written to ignore the starting
   state.  This makes them slightly slower, but has the side effect of 
   restoring any invariant that gets accidentally broken.*/
function show_login_page(message) {
  if(! message) message = "Please enter your credentials below";
  $('#welcome-page').hide()
  $('#login-username').val("")
  $('#login-password').val("")
  $('#login-message').html(message)
  $('#login-page').show()
}

function show_welcome_page(user, count) {
   $('#login-page').hide();
   $('#welcome-page').show();
   $('#welcome-message').html("Welcome "+user+"<br>You have logged in "+count+" times.");
}

function handle_login_response(data, user) {
  if( data.errCode > 0 ) {
     c = data.count;
     show_welcome_page(user, c);
  } else {
     if( debug_flag ) {
        if( data.errCode != ERR_BAD_CREDENTIALS ) {
           alert( 'Illegal error code encounted for this state');
        }
     }
     show_login_page( get_message_for_errcode(data.errCode) );  
  }
}

function handle_add_user_response(data, user) {
  if( data.errCode > 0 ) {
     c = data.count;
     show_welcome_page(user, c);
  } else {
     if( debug_flag ) {
        if( data.errCode != ERR_BAD_USERNAME && data.errCode != ERR_USER_EXISTS ) {
           alert( 'Illegal error code encounted for this state');
        }
     }
     show_login_page( get_message_for_errcode(data.errCode) );  
  }
}


$('#logout-button').click(function() {
  show_login_page();

  return false;
});
