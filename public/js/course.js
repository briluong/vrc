/*****************************************************************************/
/* Initialization Handlers */
/*****************************************************************************/
$(document).ready(function () {
    $("#create-lecture-modal").modal()
});

/*****************************************************************************/
/* Event Handlers */
/*****************************************************************************/
$("#cancel-create-lecture").click(function (event) {
    $("#create-lecture-modal").modal('close')
    $('#lectureName').val('')
    $("#lectureName").addClass("valid")
    $("#lectureName").removeClass("invalid")
    $("#lectureName-label-label").removeClass('active')
})

$("#create-lecture-form").submit(function (event) {
    var formdata = $("#create-lecture-form").serializeArray();
    console.log(formdata)
    var courseData = {"name": "courseID", "value": $("#create-lecture-form").attr("data-course")}
    formdata.push(courseData)
    createCourse(formdata)


})

/*****************************************************************************/
/* Function Handlers */
/*****************************************************************************/
function createCourse(formData) {
    $.ajax({
        url: "/api/createLecture",
        type: "POST",
        data: formData,
        success: function (resp) {
            // window.location.href = 'profile'
        },
        error: function (resp) {
            return alert("Failed to add a course");
        }
    });
}