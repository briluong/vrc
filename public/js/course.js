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
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(cs.toronto.edu)|(mail.utoronto.ca)$/;
    if (regex.test(input)) {
        $('#instructorEmail').addClass("valid")
        $("#instructorEmail").removeClass("invalid")
    } else {
        $("#instructorEmail").removeClass("valid")
        $("#instructorEmail").addClass("invalid")
        $("#instructorEmail-label").attr("data-error",
            "Invalid Email (@mail.utoronto.ca or @cs.toronto.edu required)")
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

$("#student-group-form").submit(function (event) {
    event.preventDefault()
    var data = {}
    var file = event.target[0].files[0]
    data["courseID"] = $(event.target[2]).attr('data-course')
    if (file) {
        Papa.parse(file, {
            header: true,
            complete: function (results, file) {
                console.log(results)
                if (results.error) {
                    M.toast({html:'CSV Parse Error: ' + results.error, displayLength: 3000})
                } else if (results.meta.fields.indexOf('StudentID') < 0 ||
                    results.meta.fields.indexOf('Group') < 0) {
                    M.toast({html:'Incorrect CSV format', displayLength: 3000})
                } else {
                    data["file"] = results.data
                    console.log(results.data)
                    enrollStudents(data)
                }
            }
        })
    }
    else{
        M.toast({html: 'Please submit a CSV file with a \"StudentID\" column and \"Group\ column"', displayLength: 3000})
    }
})
/*****************************************************************************/
/* Function Handlers */
/*****************************************************************************/
function createLecture(data) {
    $.ajax({
        url: "/api/createLecture",
        type: "POST",
        data: data,
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

function addInstructor(data){
    $.ajax({
        url: "/api/addInstructor",
        type: "POST",
        data: data,
        success: function (resp) {
            console.log(resp)
            location.reload();
        },
        error: function (resp) {
            console.log(resp)
            M.toast({html: 'Instructor does not exist. Please try again', displayLength: 3000})
        },
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

function enrollStudents(data){
    $.ajax({
        url: "/api/enrollStudents",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (resp) {
            console.log("Completed Add")
        },
        error: function (resp) {
            console.log(data)
            return alert("Failed to add students");
        },
        complete: function () {
            location.reload();
        }
    });
}