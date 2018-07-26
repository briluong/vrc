/**
 * Created by MichaelWang on 2018-07-19.
 */
/* Initialization Handlers */
let blob = []
let transcript = 'Unable to transcript audio'
let confidence = 0
let average_confidence = 0;
let final_confidence = 0
let recording = 'inactive'
let finalURL;
let final_transcript;
let socket = io();
/*****************************************************************************/
$(document).ready(function () {
    $('.modal').modal();
});

/*****************************************************************************/
/* Event Handlers */
/*****************************************************************************/
$("#recorder-toggle").click(function (event) {
    console.log(event)
    console.log(recording)
    if (recording == 'inactive') {
        console.log("Activated")
        final_confidence = 0
        $("#recorder-toggle-img").addClass("active-blink")
        finalURL = false
        resetTranscriptConfidence()
        document.getElementById("textBox").value = ""
        recorder()
    }
})

$("#recorder-submit").click(function (event) {
    if (recording == 'inactive' && finalURL && document.getElementById("textBox").value != "") {
        console.log("Upload 1")
        setAudioSessions(false, null)
        console.log(final_confidence)
        blobToBase64AndUpload(blob, $("#recorder-submit").attr("data-lecture"), $("#recorder-submit").attr("data-username"), final_confidence, "audio", blob.name, blob.size)
        resetTranscriptConfidence()
        $("#player").addClass("hide")
        $('#recorder-modal').modal('close')
    }
    else if (recording == 'inactive' && finalURL
        && document.getElementById("textBox").value == "") {
        console.log("Upload 2")
        setAudioSessions(false, null)
        blobToBase64AndUpload(blob, $("#recorder-submit").attr("data-lecture"), $("#recorder-submit").attr("data-username"), final_confidence, "audio", blob.name, blob.size)
        resetTranscriptConfidence()
        $("#player").addClass("hide")
        $('#recorder-modal').modal('close')
    } else if (recording == 'recording') {
        console.log("Upload fail 1")
        M.toast({html: 'Please press the recorder button to stop recording.', displayLength: 3000})
    } else if (document.getElementById("textBox").value != "") {
        //TODO: Have to implement system where user can submit a typed answer
        console.log("Upload 3")
        blobToBase64AndUpload(null, $("#recorder-submit").attr("data-lecture"), $("#recorder-submit").attr("data-username"), 1, "text", null, null)
        resetTranscriptConfidence()
        $('#recorder-modal').modal('close')
        M.toast({html: 'Message Sent!', displayLength: 3000})
    } else if (document.getElementById("textBox").value == "") {
        console.log("Upload fail 3")
        M.toast({
            html: 'Please press the recorder button to record a question, or manually type a question.',
            displayLength: 3000
        })
    } else {
        console.log("Upload fail 4")
        M.toast({html: 'Unable to record, please try again.', displayLength: 3000})
    }
})

$("#recorder-cancel").click(function () {
    setAudioSessions(false, null)
    resetTranscriptConfidence()
    document.getElementById("textBox").value = ""
    $("#player").addClass("hide")
    $("#recorder-toggle-img").removeClass("active-blink")
    $('#recorder-modal').modal('close')
})

/*****************************************************************************/
/* Function Handlers */
/*****************************************************************************/
function recorder() {
    navigator.mediaDevices.getUserMedia({audio: true, video: false})
        .then(function (stream) {
            const chunks = []
            var recorder = new MediaRecorder(stream)
            var recognition = new webkitSpeechRecognition()
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "en-US"

            recorder.onstart = function () {
                recording = recorder.state
                transcript = '';
                recognition.start();
                console.log(recording)
                console.log("Recorder service has started")
            }

            recorder.onstop = function () {
                recording = recorder.state
                console.log(recording)
                // TODO: Stop media properly
                console.log("Recorder service has ended")
                recognition.abort()
                stream.getAudioTracks().forEach(track => track.stop())
            }

            // function to be called when data is received
            recorder.ondataavailable = function (event) {
                console.log("Recorder server has available data")
                // add stream data to chunks
                chunks.push(event.data)
                // if recorder is 'inactive' then recording has finished
                if (recorder.state == 'inactive') {
                    blob = new Blob(chunks, {type: 'audio/webm'})
                    var time = new Date().getTime()
                    blob.name = Math.floor(Math.random() * (10000 - 1 + 1)) + 1 + '-' + time + '.webm'

                    // convert stream data chunks to a 'webm' audio format as a blob
                    var url = URL.createObjectURL(blob)
                    finalURL = url
                    console.log(url)
                    $("#player").removeClass("hide")
                    $("#player").attr("src", finalURL)
                }
            }

            recognition.onresult = function (event) {
                let interim_transcript = '';
                for (var i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        transcript += event.results[i][0].transcript;
                        confidence += event.results[i][0].confidence;
                        let new_confidence = confidence / event.results.length;
                        average_confidence = new_confidence
                        final_confidence = new_confidence
                        document.getElementById("recorder-confidence").innerHTML = "Average Confidence: " +
                            (new_confidence * 100).toFixed(2) + "%"
                    } else {
                        interim_transcript += event.results[i][0].transcript;
                    }
                }
                document.getElementById("textBox").value = transcript + interim_transcript
            }
            $('#recorder-toggle').click(function () {
                if (recorder.state != 'inactive') {
                    $("#recorder-toggle-img").removeClass("active-blink")
                    recorder.stop()
                }
            })
            $('#recorder-cancel').click(function () {
                if (recorder.state != 'inactive') {
                    $("#player").addClass("hide")
                    recorder.stop()
                }
            })
            recorder.start()
        }).catch(console.error)
}

function resetTranscriptConfidence() {
    confidence = 0
    average_confidence = 0
    finalURL = false
    $("#player").addClass("hide")
    document.getElementById("recorder-confidence").innerHTML = "Average Confidence: 0.00%"
}
function setAudioSessions(audioUrl, state) {
    if (audioUrl != null) finalURL = audioUrl
    if (state != null) recording = state
}

function blobToBase64AndUpload(blob, lectureID, senderName, final_confidence, type, name, size) {
    var data;
    console.log(senderName)
    console.log(type)
    if (blob != null) {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            console.log(reader.result.split(',')[1])
            data = {
                questionType: type,
                text: document.getElementById("textBox").value,
                confidence: (final_confidence * 100).toFixed(2),
                Username: senderName,
                Name: name,
                Size: size,
                lectureID: lectureID,
                data: reader.result.split(',')[1]
            }
            socket.emit('chat message', data);
            document.getElementById("textBox").value = ""
        }
    }
    else {
        data = {
            questionType: type,
            text: document.getElementById("textBox").value,
            confidence: (final_confidence * 100).toFixed(2),
            Username: senderName,
            Name: name,
            Size: size,
            lectureID: lectureID,
            data: null
        }
        socket.emit('chat message', data);
        document.getElementById("textBox").value = ""
    }
}
