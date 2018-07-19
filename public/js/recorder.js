/**
 * Created by MichaelWang on 2018-07-19.
 */
/* Initialization Handlers */
let blob = []
let transcript = 'Unable to transcript audio'
let confidence = 0
let average_confidence = 0;
let recording = 'inactive'
let finalURL;
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
    $("#recorder-toggle-img").addClass("active-blink")
    if (recording == 'inactive') {
        console.log("Activated")
        url = false
        resetTranscriptConfidence()
        recorder()
    }
})

$(".recorder-form").submit(function () {
    if (recording == 'inactive' && finalURL && document.getElementById("textBox").value != "") {
        setAudioSessions(false, null)
        resetTranscriptConfidence()
        uploadAudio()
        $("#player").addClass("hide")
        $('#recorder-modal').modal('close')
    }
    else if (recording == 'inactive' && finalURL
        && document.getElementById("textBox").value == "") {
        setAudioSessions(false, null)
        resetTranscriptConfidence()
        uploadAudio()
        $("#player").addClass("hide")
        $('#recorder-modal').modal('close')
    } else if (Session.get('state') == 'recording') {
        M.toast({html: 'Please press the recorder button to stop recording.', displayLength: 3000})
    } else if (document.getElementById("textBox").value != "") {
        //TODO: Have to implement system where user can submit a typed answer
        resetTranscriptConfidence()
        Materialize.toast({html: 'Message Sent!', displayLength: 3000})
    } else if (document.getElementById("textBox").value == "") {
        Materialize.toast({
            html: 'Please press the recorder button to record a question, or manually type a question.',
            displayLength: 3000
        })
    } else {
        Materialize.toast({html: 'Unable to record, please try again.', displayLength: 3000})
    }
})

$("#recorder-cancel").click(function(){
    setAudioSessions(false, null)
    resetTranscriptConfidence()
    $("#player").addClass("hide")
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
                console.log("Recorder service has started")
            }

            recorder.onstop = function () {
                recording = recorder.state
                // TODO: Stop media properly
                console.log("Recorder service has ended")
                stream.getTracks().forEach(track => track.stop())
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
                    recorder.stop()
                }
            })
            $('#recorder-cancel').click(function () {
                if (recorder.state != 'inactive') {
                    recorder.stop()
                }
            })
            recorder.start()
        }).catch(console.error)
}

function uploadAudio() {
    console.log(blob)
    // var lecture = Lectures.findOne(Session.get('lectureId'))
    var upload = Audios.insert({
        file: blob,
        streams: 'dynamic',
        chunkSize: 'dynamic',
        meta: {
            lectureId: "Hello",
            groupId: "Hi",
            transcript: transcript,
            confidence: average_confidence,
            mode: "lecture",
            read: false,
            notified: false
        }
    }, false)
    upload.on('end', function (error, fileObj) {
        if (error) {
            alert('Error during upload: ' + error.reason)
        } else {
            blob = []
            transcript = ''
            confidence = 0
            average_confidence = 0
            M.toast({html:'Question sent!', displayLength: 3000})
        }
    })
    upload.start()
}
function resetTranscriptConfidence() {
    confidence = 0
    average_confidence = 0
    document.getElementById("recorder-confidence").innerHTML = "Average Confidence: 0.00%"
    document.getElementById("textBox").value = ""
}
function setAudioSessions(audioUrl, state) {
    if (audioUrl != null) finalURL = audioUrl
    if (state != null) recording = state
}