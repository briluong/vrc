const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var LecturesSchema = mongoose.Schema({
    ownerId: String,
    courseID: String,
    title: String,
    active: Boolean,
    available: Boolean,
    displayQuestion: {
        type: String,
        default: "",
        optional: true
    },
    mode: {
        type: String,
        default: 'lecture',
        enum: ['lecture','group']
    },
    groupSize: {
        type: Number,
        default: 2
    },
    youtube: {
        type: String,
        optional: true
    },
    createdOn:{
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model('vrc-lecture', LecturesSchema);
