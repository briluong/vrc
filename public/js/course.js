/*****************************************************************************/
/* Initialization Handlers */
/*****************************************************************************/
$(document).ready(function () {
    $("#create-lecture-modal").modal()
    $("#add-instructor-modal").modal()
    $("#remove-instructor-modal").modal()
});

/*****************************************************************************/
/* Event Handlers */
/*****************************************************************************/
$("#cancel-create-lecture").click(function (event) {
    $("#create-lecture-modal").modal('close')
    $('#lectureName').val('')
    $("#lectureName").addClass("valid")
    $("#lectureName").removeClass("invalid")
    $("#lectureName-label").removeClass('active')
})

$("#create-lecture-form").submit(function (event) {
    var formdata = $("#create-lecture-form").serializeArray();
    console.log(formdata)
    var courseData = {"name": "courseID", "value": $("#create-lecture-form").attr("data-course")}
    formdata.push(courseData)
    createLecture(formdata)
})

$("#cancel-add-instructor").click(function (event) {
    $("#add-instructor-modal").modal('close')
    $('#instructorEmail').val('')
    $("#instructorEmail").addClass("valid")
    $("#instructorEmail").removeClass("invalid")
    $("#instructorEmail-label").removeClass('active')
})

$("#add-instructor-form").submit(function (event) {
    var formdata = $("#add-instructor-form").serializeArray();
    var courseData = {"name": "courseID", "value": $("#add-instructor-form").attr("data-course")}
    formdata.push(courseData)
    console.log(formdata)
    addInstructor(formdata)
})

$("#instructorEmail").keyup(function (event) {
    var input = $('#instructorEmail').val()
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(mail.utoronto.ca)$/;
    if (regex.test(input)) {
        $('#instructorEmail').addClass("valid")
        $("#instructorEmail").removeClass("invalid")
    } else {
        $("#instructorEmail").removeClass("valid")
        $("#instructorEmail").addClass("invalid")
        $("#instructorEmail-label").attr("data-error",
            "Invalid Email (@mail.utoronto.ca required)")
    }
});

$("a#remove-instructor-trigger").click(function (event) {
    event.preventDefault()
    console.log(event.target.parentNode)
    var instructorEmail = $(event.target.parentNode).attr('data-instructor')
    var courseID = $(event.target.parentNode).attr('data-course')
    var data = {"email": instructorEmail, "courseID": courseID}
    $("#remove-instructor-cancel").click(function (event) {
        $("#remove-instructor-modal").modal('close')
    })
    $("#confirm-remove-instructor").click(function (event) {
        removeInstructor(data)
    })
})

/*****************************************************************************/
/* Function Handlers */
/*****************************************************************************/
function createLecture(formData) {
    $.ajax({
        url: "/api/createLecture",
        type: "POST",
        data: formData,
        success: function (resp) {
        },
        error: function (resp) {
            console.log(resp)
        },
        complete: function () {
            location.reload();
        }
    });
}

function addInstructor(formData){
    $.ajax({
        url: "/api/addInstructor",
        type: "POST",
        data: formData,
        success: function (resp) {
            console.log(resp)
            // window.location.href = "course/" + formData.courseID
        },
        error: function (resp) {
            console.log(resp)
            return alert("Failed to add instructor");
        },
        complete: function () {
            location.reload();
        }
    });
}

function removeInstructor(data){
    $.ajax({
        url: "/api/removeInstructor",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (resp) {
            $("#remove-instructor-modal").modal('close')
            console.log("Completed Removal")
        },
        error: function (resp) {
            return alert("Failed to remove instructor");
        },
        complete: function () {
            location.reload();
        }
    });
}