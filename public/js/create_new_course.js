/*****************************************************************************/
/* Initialization Handlers */
/*****************************************************************************/
$(document).ready(function () {

});

/*****************************************************************************/
/* Event Handlers */
/*****************************************************************************/
$("#createCourseForm").submit(function (event) {
    event.preventDefault()
    var formdata = $("#createCourseForm").serializeArray();
    var data = {};
    $(formdata).each(function (index, obj) {
        if(obj.name == 'newCourseCode'){
            data[obj.name] = obj.value.toUpperCase();
        }
        else{
            data[obj.name] = obj.value;
        }
    });
    console.log(event.target[3].files[0])
    var file = event.target[3].files[0]
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
                    createCourse(data)
                }
            }
        })
    }
    else{
        createCourse(data)
    }
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
            location.reload()
        }
    });
}
