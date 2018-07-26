/*****************************************************************************/
/* Initialization Handlers */
/*****************************************************************************/
$(document).ready(function () {
    $('#edit-personal-modal').modal();
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