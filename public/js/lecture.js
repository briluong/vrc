/*****************************************************************************/
/* Initialization Handlers */
/*****************************************************************************/
$(document).ready(function () {
    if($(".live-now").attr("data-active") == true){
        $(".live-now").addClass("show")
    }
    else{
        $("#lecture-active-input").removeAttr("checked")
        $(".live-now").addClass("hide")
    }
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
    }
    else{
        data["active"] = false
        $("#lecture-active-input").attr("checked", "true")
        $(".live-now").removeClass("show")
        $(".live-now").addClass("hide")
    }
})
/*****************************************************************************/
/* Function Handlers */
/*****************************************************************************/
function toggleActiveLecture(data) {

}