/*****************************************************************************/
/* Initialization Handlers */
/*****************************************************************************/
$(document).ready(function () {
    $("#remove-course-modal").modal()
});

/*****************************************************************************/
/* Event Handlers */
/*****************************************************************************/
$("button.removeCourse").click(function (event) {
    event.preventDefault()
    var courseID = $(event.target).attr('data-course')
    $("#remove-course-cancel").click(function (event) {
        $("#remove-course-modal").modal('close')
    })
    $("#confirm-remove").click(function (event) {
        console.log("Hello")
        deleteCourse(courseID)
    })
})

/*****************************************************************************/
/* Function Handlers */
/*****************************************************************************/
function deleteCourse(courseID) {
    $.ajax({
        url: "/api/deleteCourse",
        type: "DELETE",
        contentType: 'application/json',
        data: JSON.stringify({"courseID": courseID}),
        success: function (resp) {
            $("#remove-course-modal").modal('close')
            $('#' + courseID).remove()
            console.log("Completed Removal")
        },
        error: function (resp) {
            return alert("Failed to add a course");
        },
        complete: function () {
            location.reload();
        }
    });
}