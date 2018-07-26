/*****************************************************************************/
/* Initialization Handlers */
/*****************************************************************************/
var typingTimer;                //timer identifier
var doneTypingInterval = 1200;  //time in ms, 1.2 secs
let socket = io();
$(document).ready(function () {
    $("#delete-question-modal").modal();
    $('.collapsible').collapsible();
    var audios = document.getElementsByClassName("audioPlayer")
    for (var i = 0; i < audios.length; i++) {
        var audio = audios[i]
        var base64 = $(audio).attr("data-audio")
        var url = b64toBlob(base64, 'audio/webm');
        $(audio).attr('src', url)
    }
});
// window.addEventListener('load', onVrViewLoad);
/*****************************************************************************/
/* Event Handlers */
/*****************************************************************************/
$(document).on('click', '.deleteQuestion', function (event) {
    console.log(event)
    questionID = $(event.currentTarget).attr('data-question')
    console.log(questionID)
    $(document).on('click', '#delete-question-cancel', function (event) {
        $("#delete-question-modal").modal('close')
    })
    $(document).on('click', '#delete-question-confirm', function (event) {
        deleteQuestion(questionID)
        delete questionID
    })
})

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

$(document).on('click', '.play-button', function (event) {
    console.log(event)
    var questionID = $(event.target).attr("data-question")
    var button = $(event.target)
    var player = document.getElementById(questionID)
    if (player.paused) {
        button.html('pause')
        player.play()
    } else {
        button.html('play_arrow')
        player.pause()
    }
    player.addEventListener('ended', function () {
        button.html('play_arrow')
        console.log("ended!")
    })
})

socket.on($("#lecture-group-toggle").attr("data-lecture"), function (data) {

    console.log(data)
    if (data.questionType == 'audio') {
        var url = b64toBlob(data.data, 'audio/webm');
        var element = "<li id=" +
            data._id +
            "List class='collection-item avatar'>" +
            "<div class='question'><audio crossorigin='anonymous' class ='audioPlayer'" +
            " id=" +
            data._id +
            " data-audio=" +
            data.data +
            " src=" +
            url +
            ">" +
            "</audio><i data-question=" +
            data._id +
            " class='play-button material-icons circle'>play_arrow</i>" +
            "<div class='title flex-container flex-container-mobile'>" +
            "<span class='left-item'>" +
            "Confidence: " +
            data.confidence +
            "%</span> " +
            "<div class='right-item'> " +
            "<span>" +
            "Student Name: " +
            data.Username +
            "</span> " +
            "<span style='margin-left:1em'>" +
            getDate() +
            "</span> " +
            "<button href='#delete-question-modal' class='deleteQuestion waves-teal btn-flat modal-trigger' data-question=" +
            data._id +
            ">" +
            "<i class='medium material-icons'>delete</i></button>" +
            "</div> " +
            "</div>" +
            "<p>" +
            data.text +
            "</p></div></li>"
    }
    else {
        var element =
            "<li id=" +
            data._id +
            "List class='collection-item avatar'>" +
            "<div class='question'>" +
            "<div class='title flex-container flex-container-mobile'>" +
            "<span class='left-item'>" +
            "Confidence: " +
            data.confidence +
            "%</span> " +
            "<div class='right-item'> " +
            "<span>" +
            "Student Name: " +
            data.Username +
            "</span> " +
            "<span style='margin-left:1em'>" +
            getDate() +
            "</span> " +
            "<button href='#delete-question-modal' class='deleteQuestion waves-teal btn-flat modal-trigger' data-question=" +
            data._id +
            ">" +
            "<i class='medium material-icons'>delete</i></button>" +
            "</div> " +
            "</div> " +
            "</div>" +
            "<p>" +
            data.text +
            "</p></div></li>"
    }
    $("#questionCard").append(element)
    M.toast({html: data.Username + " sent you a question!", displayLength: 3000})
});
/*****************************************************************************/
/* Function Handlers */
/*****************************************************************************/
function toggleActiveLecture(data) {
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
    var blobUrl = window.URL.createObjectURL(blob);
    return blobUrl
}

function getDate() {
    var date = new Date
    var dd = date.getDate();
    var mm = date.getMonth() + 1;

    var yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var finalDate = dd + '/' + mm + '/' + yyyy;
    return finalDate
}

function deleteQuestion(questionID) {
    console.log("QuestionID: " + questionID)
    $.ajax({
        url: "/api/deleteQuestion",
        type: "DELETE",
        contentType: 'application/json',
        data: JSON.stringify({"questionID": questionID}),
        success: function (resp) {
            $("#delete-question-modal").modal('close')
            $('#' + questionID + "List").remove()
            console.log("Completed Removal")
        },
        error: function (resp) {
            return alert("Failed to delete a question");
        }
    });
}
