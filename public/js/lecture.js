/*****************************************************************************/
/* Initialization Handlers */
/*****************************************************************************/
$(document).ready(function () {
    if($(".live-now").attr("data-active")){
        $("#lecture-active-input").attr("checked", "true")
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
    if($("#lecture-active-input").prop("checked")){
        $("#lecture-active-input").removeAttr("checked")
        $(".live-now").removeClass("hide")
        $(".live-now").addClass("show")
    }
    else{
        $("#lecture-active-input").attr("checked", "true")
        $(".live-now").removeClass("show")
        $(".live-now").addClass("hide")
    }

    console.log(event)

})
/*****************************************************************************/
/* Function Handlers */
/*****************************************************************************/