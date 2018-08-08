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


$(document).on('click', '.deleteFeedback', function (event) {
    console.log(event)
    feedbackID = $(event.currentTarget).attr('data-feedback')
    console.log(feedbackID)
    $(document).on('click', '#delete-feedback-cancel', function (event) {
        $("#delete-feedback-modal").modal('close')
    })
    $(document).on('click', '#delete-feedback-confirm', function (event) {
        deleteFeedback(feedbackID)
        delete feedbackID
    })
})

$("#lecture-active-input").on("change", function (event) {
    var data = {}
    if ($("#lecture-active-input").prop("checked")) {
        data["active"] = true
        $("#lecture-active-input").removeAttr("checked")
        $("#group-settings").removeClass("hide")
        $("#youtube-input").removeClass("hide")
    }
    else {
        data["active"] = false
        $("#lecture-active-input").attr("checked", "true")
        $("#group-settings").addClass("hide")
        $("#youtube-input").addClass("hide")
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
        $("#update-group").removeClass("hide")
    }
    else {
        data["groupActive"] = false
        $("#lecture-group-input").attr("checked", "true")
        $("#update-group").addClass("hide")
    }
    data["lectureID"] = $("#lecture-group-toggle").attr("data-lecture")
    data["courseID"] = $("#lecture-group-toggle").attr("data-course")
    toggleGroupActiveLecture(data)
})

$("#clear-group-settings").on('click', function (event) {
    console.log(event)
    console.log($("#group-file"))
    $("#group-file").val("")
    $("#displayQuestion").val("")
    clearBoardAndDelete(lectureID)
    console.log($("#group-file"))
})

$("#update-group-settings").on('click', function (event) {
    console.log(event)
    if ($("#displayQuestion").val() == "" && $("#group-file").val() == "" &&
        document.getElementById("group-file").files.length == 0) {
        var lectureID = $("#lectureToggle-container").attr("data-lecture")
        clearBoardAndDelete(lectureID)
    }
    else if($("#displayQuestion").val() != "" && $("#group-file").val() != "" &&
        document.getElementById("group-file").files.length != 0){
        M.toast({html: "Cannot upload file and question at the same time. Clear and try again!", displayLength: 3000})
    }
    else if($("#displayQuestion").val() != ""){
        $("#group-file").val("")
        var lectureID = $("#lectureToggle-container").attr("data-lecture")
        sendQuestionToGroup($("#displayQuestion").val(), lectureID)
    }
    else if($("#group-file").val() != ""){
        $("#displayQuestion").val("")
        var lectureID = $("#lectureToggle-container").attr("data-lecture")
        sendFileToGroup(document.getElementById("group-file").files[0], lectureID)
    }
    console.log($("#group-file"))
})

$("#instructorNotification-input").on("change", function (event) {
    var data = {}
    if ($("#instructorNotification-input").prop("checked")) {
        data["notifications"] = true
        M.toast({html: "Notifications turned on", displayLength: 3000})
    }
    else {
        data["notifications"] = false
        M.toast({html: "Notifications turned off", displayLength: 3000})
    }
    data["lectureID"] = $("#instructorNotification-toggle").attr("data-lecture")
    data["courseID"] = $("#instructorNotification-toggle").attr("data-course")
    toggleNotifications(data)
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
    if (data.questionType != null) {
        if (data.questionType == 'audio') {
            var url = b64toBlob(data.data, 'audio/webm');
            var element = "<div id=" +
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
                "</p></div></div>"
        }
        else {
            var element =
                "<div id=" +
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
                "</p></div></div>"
        }
        $("#questionCard-collection").append(element)
        if ($("#questionCard").attr("data-notifications") == 'true') {
            var audio = new Audio('/assets/unconvinced.mp3');
            audio.play();
        }
        M.toast({html: data.Username + " sent you a question!", displayLength: 3000})
    } else {
        var element =
            "<div id=" +
            data._id +
            "List class='collection-item avatar'>" +
            "<div class='feedback'>" +
            data.value + " by " + data.sentBy +
            "</div></div>"

        $("#feedbackCard").append(element);
    }
});

socket.on($("#lectureToggle-container").attr("data-lecture") + "-lectureToggle", function (data) {
    console.log(data)
    if (data.active) {
        $(".live-now").removeClass("hide")
        $("#card-title").html("Live")
        if (($("#lectureToggle-container").attr("data-groupactive")) == 'false') {
            $("#youtube-enter-stream").removeClass("hide")
        }
        else {
            $(".vr-enter-stream").removeClass("hide")
        }
        if (checkYoutubeURL($('input#youtubeURL').val()) != false &&
            $("#enter-stream-button").attr("href") == $("#enter-stream-button").attr("data-stream")) {
            $(".video-container").removeClass("hide")
        }
        $("#youtube-container").attr("src", embedYoutubeURL($("#youtubeURL").val()))
        $("#notActive-warning").addClass("hide")
    }
    else {
        $(".video-container").addClass("hide")
        $("#card-title").html("Offline")
        if (!($(".vr-enter-stream").hasClass("hide"))) {
            $(".vr-enter-stream").addClass("hide")
        }
        $("#youtube-enter-stream").addClass("hide")
        $(".live-now").addClass("hide")
        if ($("#notActive-warning").hasClass("hide")) {
            $("#notActive-warning").removeClass("hide")
        }
    }
})

socket.on($("#lectureToggle-container").attr("data-lecture") + "-groupToggle", function (data) {
    console.log(data)
    if (data.groupActive) {
        $("#youtube-enter-stream").addClass("hide")
        $("#lectureToggle-container").attr("data-groupActive", 'true')
        $(".vr-enter-stream").removeClass("hide")
    }
    else {
        $("#youtube-enter-stream").removeClass("hide")
        $("#lectureToggle-container").attr("data-groupActive", 'false')
        $(".vr-enter-stream").addClass("hide")
    }
})

socket.on($("#lecture-group-toggle").attr("data-lecture") + "-Help", function (data) {
    console.log(data)
    var element =
        "<div class='right-item' id=" +
        "Group" + data.groupName + "-help" +
        " style='color:red;'>" +
        "[HELP REQUESTED]" +
        "</div>"
    $("#Group" + data.groupName).append(element)
    M.toast({html: "Group " + data.groupName + " requested for help!", displayLength: 3000})
})

socket.on($("#lecture-group-toggle").attr("data-lecture") + "-DeleteHelp", function (data) {
    console.log(data)
    $("#Group" + data.groupName + "-help").remove()
    M.toast({html: "Group " + data.groupName + " does not need help anymore!", displayLength: 3000})
})

socket.on($("#lectureToggle-container").attr("data-lecture") + "-updateYoutube", function (data) {
    console.log(data)
    if (checkYoutubeURL(data.youtube) == "youtube") {
        $(".video-container").removeClass("hide")
        var splitURL = data.youtube.split("watch?v=")
        var youtubeURL = splitURL[0] + "embed/" + splitURL[1]
        $("#youtube-container").attr("src", youtubeURL)
        $(".video-container").removeClass("hide")
        $("#enter-stream-button").attr("href", $("#enter-stream-button").attr("data-stream"))
    }
    else if (checkYoutubeURL(data.youtube) == "other") {
        $(".video-container").addClass("hide")
        $("#enter-stream-button").attr("href", $("#enter-stream-button").attr("data-stream360"))
    }
    M.toast({html: "The stream link has been updated!", displayLength: 3000})
})
/*****************************************************************************/
/* Function Handlers */
/*****************************************************************************/
function toggleActiveLecture(data) {
    socket.emit("toggleActiveLecture", data)
}

function toggleGroupActiveLecture(data) {
    socket.emit("toggleGroupActiveLecture", data)
}

function toggleNotifications(data) {
    $.ajax({
        url: "/api/toggleNotifications",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (resp) {
            console.log("Completed Notifications Toggle")
            if (data.notifications) {
                $("#questionCard").attr("data-notifications", 'true')
            }
            else {
                $("#questionCard").attr("data-notifications", 'false')
            }
        },
        error: function (resp) {
            console.log(data)
            return alert("Failed to toggle notifications");
        },
        complete: function () {
        }
    });
}

function doneTyping() {
    let val = $('input#youtubeURL').val()
    if (checkYoutubeURL(val) != false) {
        let lectureID = $("#youtubeURL").attr("data-lecture")
        let data = {}
        data["youtube"] = val
        data["lectureID"] = lectureID
        socket.emit("updateYoutube", data)
    }
    else {
        M.toast({html: "Please enter a valid Youtube URL", displayLength: 3000})
    }
}

function checkYoutubeURL(url) {
    let youtubeRegex = /^(http(s)??\:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+/;
    let streamFileRegex = /^(http(s)??\:\/\/)?(.+)?(.mpd|.m3u8|.mp4)/;
    if (youtubeRegex.test((url))) {
        return "youtube"
    }
    else if (streamFileRegex.test((url))) {
        return "other"
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

function deleteFeedback(feedbackID) {
    console.log("FeedbackID: " + feedbackID)
    $.ajax({
        url: "/api/deleteFeedback",
        type: "DELETE",
        contentType: 'application/json',
        data: JSON.stringify({"feedbackID": feedbackID}),
        success: function (resp) {
            $("#delete-feedback-modal").modal('close')
            var feedbackType = $('#' + feedbackID + "List").find('p').attr("data-feedbackType")
            $('#' + feedbackID + "List").remove()
            updateFeedbackCount(feedbackType)
            console.log("Completed Removal")
        },
        error: function (resp) {
            return alert("Failed to delete a Feedback");
        }
    });
}

function embedYoutubeURL(url) {
    var splitURL = url.split("watch?v=")
    if (splitURL.length < 2) {
        return splitURL[0]
    }
    return splitURL[0] + "embed/" + splitURL[1]
}

function updateFeedbackCount(feedbackType) {
    var count = 0
    var allFeedback = $(".feedbackType")
    for (let i = 0; i < allFeedback.length; i++) {
        if ($(allFeedback[i]).attr("data-feedbackType") == feedbackType) {
            count++;
        }
    }
    if (feedbackType == "TDown") {
        $("#countDown").html(count)
    }
    else if (feedbackType == "TUp") {
        $("#countUp").html(count)
    }
    else if (feedbackType == "Confused") {
        $("#countConfused").html(count)
    }
}

function sendQuestionToGroup(question ,lectureID) {
    var data = {question: question, lectureID: lectureID}
    socket.emit("instructorQuestion", data)
}

function sendFileToGroup(file, lectureID) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        var data = {file: reader.result, lectureID: lectureID}
        socket.emit("instructorFile", data)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

function clearBoardAndDelete(lectureID) {
    var data = {lectureID: lectureID}
    socket.emit("instructorClear", data)
}
