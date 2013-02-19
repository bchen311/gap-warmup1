// Constants for error codes
ERR_BAD_CREDENTIALS = -1;
ERR_USER_EXISTS = -2;
ERR_BAD_USERNAME = -3;
ERR_BAD_PASSWORD  = -4;

/*
  Helper function to form the ajax call given the url, data, and what to do upon success or failure

  @param String url - The url to make the ajax call to
  @param Dictionary data - The dictionary object containing the data to be sent
  @param fn successCallback - The function to be called if the ajax call is successful
  @param fn failCallback - The function to be called if the ajax call fails
*/
function ajaxCall(url, data, successCallback, failCallback) {
    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "json",
        success: successCallback,
        failure: failCallback
    });
}

/* 
  Takes an error code and returns the proper error message for that error code.

  @param int code - The error code for the error message
*/
function returnErrorMessage(code) {
    if(code == ERR_BAD_CREDENTIALS) {
        return 'Username and password combination not valid. Please try again.';
    } else if(code == ERR_BAD_USERNAME) {
        return 'This username is not valid. Please pick a different username.';
    } else if(code == ERR_USER_EXISTS) {
        return 'This username already exists. Please pick a different username.';
    } else if(code == ERR_BAD_PASSWORD) {
        return 'This password is not valid. Please pick a different password.';
    } else {
        // None of the codes are matched, return unknown error
        return 'Unknown error occured: ' + code;
    }
}

/* 
  Hide the welcome page and show the login page.

  @param String message - The message to be shown in the login page
*/
function showLoginPage(message) {
    if(message == null) {
        message = 'Please enter your credentials below';
    }
    $('#welcomePage').hide();
    $('#loginUsername').val('');
    $('#loginPassword').val('');
    $('#messageBox').html(message);
    $('#loginPage').show();
}

/*
  Show the welcome page with the username and the number of times he/she has logged in.

  @param String username - The username of the person logging in
  @param int count - The number of times the person has logged in
*/
function showWelcomePage(username, count) {
    $('#loginPage').hide();
    $('#welcomePage').show();
    $('#welcomeMessage').html("Welcome " + username + "<br />You have logged in " + count + " times.");
}

/*
  Handle the response from the ajax call
  If the ajax call is successful, show the welcome page.  Otherwise, display the error message

  @param JSON data - JSON object returned from the ajax call
  @param String username - The username of the person
*/
function handleAjaxResponse(data, username) {
    err = data.errCode;
    if(err > 0) {
        showWelcomePage(username, data.count);
    } else {
        errMessage = returnErrorMessage(err);
        showLoginPage(errMessage);  
    }
}

/*
  Hide everything until document is ready.
*/
$('#loginPage').hide();
$('#welcomePage').hide();
$('#messageBox').html("Please enter your credentials below");

/*
  Once the document is ready, show the login page and add functionality to the buttons
*/
$(document).ready(function() {
   showLoginPage();

   /*
     When the login button is clicked, send an ajax call to /users/login with the username and password data
   */
   $('#loginButton').click(function() {
      username = $('#loginUsername').val();
      password = $('#loginPassword').val();
      ajaxCall("/users/login", 
                  { user: username,
                    password: password },
                  function(data) { 
                     return handleAjaxResponse(data, username);
                  },
                  function(err) {
                     alert('Error occurred on request: ' + err);
                  });
      return false;
   });

   /*
     When the add user button is clicked, send an ajax call to /users/add with the username and password data
   */
   $('#addUserButton').click(function() {
      username = $('#loginUsername').val();
      password = $('#loginPassword').val();
      ajaxCall("/users/add",
                  { user: username,
                    password: password },
                  function(data) {
                     return handleAjaxResponse(data, username);
                  },
                  function(err) {
                     alert('Error occurred on request: ' + err);
                  });
      return false;
   });

   /*
     When the logout button is clicked, return to the login window
   */
   $('#logoutButton').click(function() {
      showLoginPage();
      return false;
   });
});

