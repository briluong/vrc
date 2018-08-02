/*****************************************************************************/
/* Initialization Handlers */
/*****************************************************************************/
$(document).ready(function () {
    $('.modal').modal();
});
/*****************************************************************************/
/* Event Handlers */
/*****************************************************************************/
$("#confirm-modal-trigger").click(function (event) {
    console.log(event)
    $("#confirm-cancel-change").click(function (event) {
        console.log(event)
        $("#edit-personal-modal").modal('close')
    })

    $("#confirm-change").click(function (event) {
        console.log(event)
        var data = {firstName: $("#firstName").val(),lastName:$("#lastName").val()}
        changeSettings(data)
        $("#edit-personal-modal").modal('close')

    })
})

$("#newPassword").keyup(function (event) {
    var input = $('#newPassword').val()
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (regex.test(input)) {
        $('#newPassword').addClass("valid")
        $("#newPassword").removeClass("invalid")
    } else {
        $("#newPassword").removeClass("valid")
        $("#newPassword").addClass("invalid")
        $("#newPassword-label").attr("data-error",
            "Password must have at least eight characters, one uppercase letter, one lowercase letter and one number")
    }
});

$("#newPasswordConfirm").keyup(function (event) {
    var input = $('#newPasswordConfirm').val()
    if (input == $('#newPassword').val()) {
        $('#newPasswordConfirm').addClass("valid")
        $("#newPasswordConfirm").removeClass("invalid")
    } else {
        $("#newPasswordConfirm").removeClass("valid")
        $("#newPasswordConfirm").addClass("invalid")
        $("#newPasswordConfirm-label").attr("data-error",
            "Passwords do not match.")
    }
});


$("#passwordCancel").click(function (event) {
    $("#edit-password-modal").modal('close')
})

$("#passwordSubmit").click(function (event) {
    var data = {currentPassword: $("#currentPassword").val(),newPassword:$("#newPassword").val(), newPasswordConfirm: $("#newPasswordConfirm").val()}
    changePassword(data)
    $("#edit-password-modal").modal('close')
})



/*****************************************************************************/
/* Function Handlers */
/*****************************************************************************/
function changeSettings(data){
    $.ajax({
        url: "/api/changeSettings",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (resp) {
            console.log("Completed settings change");
        },
        error: function (resp) {
            console.log(data)
        },
        complete: function () {
            location.reload()
        }
    });
}

function changePassword(data){
    $.ajax({
        url: "/api/changePassword",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (resp) {
            console.log("Completed password change");
        },
        error: function (resp) {
            console.log(data)
        },
        complete: function () {
            location.reload()
        }
    });
}