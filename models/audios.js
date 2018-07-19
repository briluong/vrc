const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

Audios = new FilesCollection({
    debug: false,
    storagePath: '/vr/audios',
    permissions: 0774,
    parentDirPermissions: 0774,
    collectionName: 'Audios',
    allowClientCode: false,
    OnBeforeUpload: function (file) {
        if (file.size <= 100 * 1024 * 1024) {
            // limit attachment files size to 100MB
            return true
        } else {
            return "Audio file larger than 100MB"
        }
    }
});

var AudiosSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        label: 'Uploaded time',
        default: new Date()
    },
    size: {
        type: Number
    },
    name: {
        type: String
    },
    type: {
        type: String
    },
    path: {
        type: String
    },
    isVideo: {
        type: Boolean
    },
    isAudio: {
        type: Boolean
    },
    isImage: {
        type: Boolean
    },
    isText: {
        type: Boolean
    },
    isJSON: {
        type: Boolean
    },
    isPDF: {
        type: Boolean
    },
    extension: {
        type: String,
        optional: true
    },
    _storagePath: {
        type: String
    },
    _downloadRoute: {
        type: String
    },
    _collectionName: {
        type: String
    },
    public: {
        type: Boolean,
        optional: true
    },
    meta: {
        type: Object,
        optional: true
    },
    userId: {
        type: String,
        optional: true
    },
    updatedAt: {
        type: Date,
        optional: true
    },
    versions: {
        type: Object
    }
});

// Export the audio model.
module.exports = mongoose.model('vr-audios', AudiosSchema);
