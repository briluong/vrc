/**
 * Created by MichaelWang on 2018-07-09.
 */
/*****************************************************************************/
/* Initialization Handlers */
/*****************************************************************************/
$(document).ready(function () {
    $('.modal').modal();
    $('#registerAccountType').formSelect();
    $('#utoridInput').hide()
    // validate_field("#registerEmail");
    // validate_field("#registerUTORID");
    // validate_field("#registerPassword");

});

/*****************************************************************************/
/* Event Handlers */
/*****************************************************************************/
$("#loginSubmit").click(function (event) {
    // event.preventDefault()
    // var email = $('#loginEmail').val()
    // var password = $('#loginPassword').val()
    // if (email != "" && password != "") {
        // Meteor.loginWithPassword(email, password, function(error) {
        // log error, otherwise dismiss modal
        // if (error) {
        //     console.log(error)
        //     // display error code to user
        //     if (error.reason === "Incorrect password") {
        //         $("#loginPassword").removeClass("validate")
        //         $("#loginPassword").removeClass("valid")
        //         $("#loginPassword").addClass("invalid")
        //         $("#loginPassword-label").attr("data-error", error.reason)
        //     } else if (error.reason === "User not found") {
        //         $("#loginEmail").removeClass("validate")
        //         $("#loginEmail").removeClass("valid")
        //         $("#loginEmail").addClass("invalid")
        //         $("#loginEmail-label").attr("data-error", error.reason)
        //     }
        // } else {
        // resetLoginInput()
        // console.log("Email: " + email);
        // console.log("Password: " + password)
        // $('#login-modal').modal('close')
    // });
    // }});

});

$("#loginCancel").click(function (event) {
    // console.log(event)
    resetLoginInput()
    $('#login-modal').modal('close')
});

$("#registerSubmit").click(function (event) {
    // event.preventDefault()
    // var firstName = $('#registerFirstName').val()
    // var lastName = $('#registerLastName').val()
    // var email = $('#registerEmail').val()
    // var password = $('#registerPassword').val()
    // var accountType = $('#registerAccountType').val()
    // var utorid = $('#registerUTORID').val()
    // resetRegisterInput()
    // console.log("First Name: " + firstName)
    // console.log("Last Name: " + lastName)
    // console.log("Email: " + email)
    // console.log("Password: " + password)
    // console.log("Account Type: " + accountType)
    // console.log("Utorid: " + utorid)
    // $('#register-modal').modal('close')

});

$("#registerCancel").click(function (event) {
    console.log(event)
    resetRegisterInput()
    $('#register-modal').modal('close')
});

$("#registerAccountType").change(function (event) {
    var accountType = $('#registerAccountType').val()
    if(accountType == "" || accountType == "instructor" ){
        $('#utoridInput').hide()
        $('#registerUTORID').val('')
        $("#registerUTORID").addClass("valid")
        $("#registerUTORID").removeClass("invalid")
    }
    else{
        $('#utoridInput').show()
    }
});

$("#registerPassword").keyup(function (event) {
    var input = $('#registerPassword').val()

    if (input.length >= 6) {
        $('#registerPassword').addClass("valid")
        $("#registerPassword").removeClass("invalid")
    } else {
        $("#registerPassword").removeClass("valid")
        $("#registerPassword").addClass("invalid")
        $("#registerPassword-label").attr("data-error",
            "Password must be at least 6 characters long")
    }
});

$("#registerEmail").keyup(function (event) {
    var input = $('#registerEmail').val()
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(mail.utoronto.ca)$/;
    if (regex.test(input)) {
        $('#registerEmail').addClass("valid")
        $("#registerEmail").removeClass("invalid")
    } else {
        $("#registerEmail").removeClass("valid")
        $("#registerEmail").addClass("invalid")
        $("#registerEmail-label").attr("data-error",
            "Invalid Email (@mail.utoronto.ca required)")
    }
});

$("#registerUTORID").keyup(function (event) {
    var input = $('#registerUTORID').val()
    if (input.length == 10) {
        $('#registerUTORID').addClass("valid")
        $("#registerUTORID").removeClass("invalid")
    } else {
        $("#registerUTORID").removeClass("valid")
        $("#registerUTORID").addClass("invalid")
        $("#registerUTORID-label").attr("data-error", "Invalid UTORID")
    }
});

/*****************************************************************************/
/* Function Handlers */
/*****************************************************************************/
function resetLoginInput() {
    $('#loginEmail').val('')
    $("#loginEmail").addClass("valid")
    $("#loginEmail").removeClass("invalid")
    $("#loginEmail-label").removeClass('active')
    $('#loginPassword').val('')
    $('#loginPassword').addClass('valid')
    $('#loginPassword').removeClass('invalid')
    $('#loginPassword-label').removeClass("active")
}

function resetRegisterInput() {
    $('#registerFirstName').val('')
    $("#registerFirstName-label").removeClass("active")
    $('#registerLastName').val('')
    $("#registerLastName-label").removeClass("active")
    $('#registerEmail').val('')
    $('#registerEmail').addClass("valid")
    $("#registerEmail").removeClass("invalid")
    $("#registerEmail-label").removeClass("active")
    $('#registerPassword').val('')
    $('#registerPassword').addClass("valid")
    $("#registerPassword-label").removeClass("active")
    $("#registerEmail-label").removeClass("active")
    $('#registerAccountType').val('')
    $('#registerUTORID').val('')
    $("#registerUTORID").addClass("valid")
    $("#registerUTORID").removeClass("invalid")
    $("#registerUTORID-label").removeClass("active")
}

/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function showOrHideNavLinks() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}