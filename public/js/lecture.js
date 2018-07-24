/*****************************************************************************/
/* Initialization Handlers */
/*****************************************************************************/
var typingTimer;                //timer identifier
var doneTypingInterval = 1200;  //time in ms, 1.2 secs
let socket = io();
$(document).ready(function () {
    $('.collapsible').collapsible();
    var audios = document.getElementsByClassName("audioPlayer")
    for(var i = 0; i < audios.length; i++) {
        var audio = audios[i]
        var base64 = $(audio).attr("data-audio")
        var url = b64toBlob(base64, 'audio/webm');
        $(audio).attr('src', url)
    }
});

/*****************************************************************************/
/* Event Handlers */
/*****************************************************************************/
$("#lecture-active-input").on("change", function (event) {
    var data = {}
    if ($("#lecture-active-input").prop("checked")) {
        data["active"] = true
        $("#lecture-active-input").removeAttr("checked")
        $(".live-now").removeClass("hide")
        $("#group-settings").removeClass("hide")
        if (!($("#lecture-group-input").prop("checked"))) {
            $("#youtube-enter-stream").removeClass("hide")
        }
        console.log($("#card-title"))
        $("#card-title").html("Live")
        $("#youtube-input").removeClass("hide")
        if (checkYoutubeURL($('input#youtubeURL').val())) {
            $(".video-container").removeClass("hide")
        }
    }
    else {
        data["active"] = false
        $("#lecture-active-input").attr("checked", "true")
        $(".live-now").addClass("hide")
        $("#group-settings").addClass("hide")
        $("#youtube-enter-stream").addClass("hide")
        if (!($(".vr-enter-stream").hasClass("hide"))) {
            $(".vr-enter-stream").addClass("hide")
        }
        $("#card-title").html("Offline")
        $("#youtube-input").addClass("hide")
        $(".video-container").addClass("hide")

    }
    data["lectureID"] = $("#lecture-active-toggle").attr("data-lecture")
    data["courseID"] = $("#lecture-active-toggle").attr("data-course")
    toggleActiveLecture(data)

})

$("#lecture-group-input").on("change", function (event) {
    var data = {}
    if ($("#lecture-group-input").prop("checked")) {
        data["groupActive"] = true
        $("#lecture-group-input").removeAttr("checked")
        $(".vr-enter-stream").removeClass("hide")
        $("#update-clear-group").removeClass("hide")
        $("#youtube-enter-stream").addClass("hide")
    }
    else {
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

$('input#youtubeURL').bind("input", function (event) {
    clearTimeout(typingTimer);
    if ($('input#youtubeURL').val()) {
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    }
});

$(".play-button").click(function (event) {
    var questionID = $(event.target).attr("data-question")
    var player = document.getElementById(questionID)
    if (player.paused) {
        var playPromise = player.play()
        if (playPromise !== undefined) {
            playPromise.then(function() {
                // Automatic playback started!
            }).catch(function(error) {
                // Automatic playback failed.
                console.log(error)
                // Show a UI element to let the user manually start playback.
            });
        }
    } else {
        player.pause()
    }
    player.addEventListener('ended', function() {
        console.log("ended!")
    })
})

socket.on($("#lecture-group-toggle").attr("data-lecture"), function (data) {
    console.log (data);
    if(data.questionType = 'audio'){
        var blob = new Blob(data.data, {type: 'audio/webm'})
        var url = URL.createObjectURL(blob)
        console.log(url)
    }
    else{
    }
    M.toast({html: data.Username + " sent you a question!", displayLength: 3000})
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

function doneTyping() {
    let val = $('input#youtubeURL').val()
    let regex = /^(http(s)??\:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+/;
    if (regex.test((val))) {
        let lectureID = $("#youtubeURL").attr("data-lecture")
        let data = {}
        data["youtube"] = val
        data["lectureID"] = lectureID
        console.log("true")
        $.ajax({
            url: "/api/updateYoutube",
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (resp) {
                var splitURL = val.split("watch?v=")
                var youtubeURL = splitURL[0] + "embed/" + splitURL[1]
                $("#youtube-container").attr("src", youtubeURL)
                $(".video-container").removeClass("hide")
                console.log("Completed updating Youtube Link")
            },
            error: function (resp) {
                console.log(data)
                return alert("Failed to update Youtube Link");
            },
            complete: function () {
            }
        });
    }
    else {
        M.toast({html: "Please enter a valid Youtube URL", displayLength: 3000})
        console.log("false")
    }
}

function checkYoutubeURL(url) {
    let regex = /^(http(s)??\:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+/;
    if (regex.test((url))) {
        return true
    }
    return false
}

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    console.log(blob)
    var blobUrl = window.URL.createObjectURL(blob);
    return blobUrl
}
