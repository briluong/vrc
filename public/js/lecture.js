/*****************************************************************************/
/* Initialization Handlers */
/*****************************************************************************/
$(document).ready(function () {

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
        $(".live-now").addClass("show")
        $("#group-settings").removeClass("hide")
        $("#group-settings").addClass("show")
        $("#youtube-enter-stream").removeClass("hide")
        $("#youtube-enter-stream").addClass("show")
    }
    else{
        data["active"] = false
        $("#lecture-active-input").attr("checked", "true")
        $(".live-now").removeClass("show")
        $(".live-now").addClass("hide")
        $("#group-settings").removeClass("show")
        $("#group-settings").addClass("hide")
        $("#youtube-enter-stream").addClass("hide")
        $("#youtube-enter-stream").removeClass("show")
    }
    data["lectureID"] = $("#lecture-active-toggle").attr("data-lecture")
    data["courseID"] = $("#lecture-active-toggle").attr("data-course")
    toggleActiveLecture(data)

})
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

