const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var LecturesSchema = mongoose.Schema({
    ownerId: String,
    courseID: String,
    title: String,
    active: Boolean,
    available: Boolean,
    groupActive: {
        type: Boolean,
        default: false
    },
    displayQuestion: {
        type: String,
        default: "",
        optional: true
    },
    mode: {
        type: String,
        defaultValue: 'lecture',
        allowedValues: ['lecture','group']
    },
    groupSize: {
        type: Number,
        defaultValue: 2
    },
    youtube: {
        type: String,
        optional: true,
        default: ""
    },
    createdOn:{
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model('vrc-lecture', LecturesSchema);
