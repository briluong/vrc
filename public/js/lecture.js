/*****************************************************************************/
/* Initialization Handlers */
/*****************************************************************************/
$(document).ready(function () {
    $('.collapsible').collapsible();
});

/*****************************************************************************/
/* Event Handlers */
/*****************************************************************************/

$("#lecture-active-input").on("change",function(event) {
    var data = {}
    if($("#lecture-active-input").prop("checked")){
        data["active"] = true
        $("#lecture-active-input").removeAttr("checked")
        $(".live-now").removeClass("hide")
        $("#group-settings").removeClass("hide")
        if(!($("#lecture-group-input").prop("checked"))) {
            $("#youtube-enter-stream").removeClass("hide")
        }
        console.log($("#card-title"))
        $("#card-title").html("Live")
    }
    else{
        data["active"] = false
        $("#lecture-active-input").attr("checked", "true")
        $(".live-now").addClass("hide")
        $("#group-settings").addClass("hide")
        $("#youtube-enter-stream").addClass("hide")
        if(!($(".vr-enter-stream").hasClass("hide"))){
            $(".vr-enter-stream").addClass("hide")
        }
        $("#card-title").html("Offline")
    }
    data["lectureID"] = $("#lecture-active-toggle").attr("data-lecture")
    data["courseID"] = $("#lecture-active-toggle").attr("data-course")
    toggleActiveLecture(data)

})

$("#lecture-group-input").on("change",function(event) {
    var data = {}
    if($("#lecture-group-input").prop("checked")){
        data["groupActive"] = true
        $("#lecture-group-input").removeAttr("checked")
        $(".vr-enter-stream").removeClass("hide")
        $("#update-clear-group").removeClass("hide")
        $("#youtube-enter-stream").addClass("hide")
    }
    else{
        data["groupActive"] = false
        $("#lecture-group-input").attr("checked", "true")
        $(".vr-enter-stream").addClass("hide")
        $("#update-clear-group").addClass("hide")
        $("#youtube-enter-stream").removeClass("hide")
    }
    data["lectureID"] = $("#lecture-group-toggle").attr("data-lecture")
    data["courseID"] = $("#lecture-group-toggle").attr("data-course")
    toggleGroupActiveLecture(data)
})

$('input#youtubeURL').bind("change keyup input",function(event) {
    // handle events here
    console.log(event)
});
/*****************************************************************************/
/* Function Handlers */
/*****************************************************************************/
function toggleActiveLecture(data) {
    console.log(data)
    $.ajax({
        url: "/api/toggleActiveLecture",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (resp) {
            console.log("Completed Add")
        },
        error: function (resp) {
            console.log(data)
            return alert("Failed to toggle lecture");
        },
        complete: function () {
        }
    });
}

function toggleGroupActiveLecture(data) {
    console.log(data)
    $.ajax({
        url: "/api/toggleGroupActiveLecture",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (resp) {
            console.log("Completed Group Active Toggle")
        },
        error: function (resp) {
            console.log(data)
            return alert("Failed to toggle Group");
        },
        complete: function () {
        }
    });
}

