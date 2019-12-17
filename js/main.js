// main.js
$(document).ready(function() {

  if ($('#login-form').length) {

    $('#login-form').submit(function(e) {
      e.preventDefault();
      var username = $('#login-form #login-username').val();
      var password = $('#login-form #login-password').val();
      $.ajax({
        type: 'POST',
        url: `${BASE_URL}/login`,
        data: {username: username, password: password},
        success: function(resp) {
          console.log(resp);
        },
        error: function(xhr, status, error) {
          $('#login-notification-container').html(`<div class='mt-2 alert alert-danger'>Something went wrong :/</div>`);
        }
      });
    });

  }

});
