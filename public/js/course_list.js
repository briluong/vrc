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
    $("#remove-course-modal").modal('open')
    console.log(event.target)
    var courseID = event.target
    $("#remove-course-cancel").click(function (event) {

    })


    $("#confirm-remove").click(function (event) {

    })
})




/*****************************************************************************/
/* Function Handlers */
/*****************************************************************************/
function createCourse(formData) {
    $.ajax({
        url: "/api/createCourse",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function (resp) {
            window.location.href = 'profile'
        },
        error: function (resp) {
            return alert("Failed to add a course");
        }
    });
}