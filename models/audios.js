const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//from meteor
// Audios = new FilesCollection({
//     debug: false,
//     storagePath: '/vr/audios',
//     permissions: 0774,
//     parentDirPermissions: 0774,
//     collectionName: 'Audios',
//     allowClientCode: false,
//     OnBeforeUpload: function(file) {
//         if (Meteor.user()) {
//             if (file.size <= 100*1024*1024) {
//                 // limit attachment files size to 100MB
//                 return true
//             } else {
//                 return "Audio file larger than 100MB"
//             }
//         }
//     }
// });

var AudiosSchema = new SimpleSchema({
    createdAt: {
        type: Date,
        label: 'Uploaded time',
        autoValue: function() {
            if (!this.isSet) return new Date()
        }
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
        blackbox: true,
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
        type: Object,
        blackbox: true
    }
});


// USER METHODS

// base function if one is needed later
coursesSchema.methods.methodName = function(parameter) {
    return ;
};


// Export the audio model.
module.exports = mongoose.model('vr-classromm-audios', audiosSchema);

// from meteor
// if (Meteor.isServer) {
//     Meteor.publish('Audios', function(lectureId) {
//         var user = Meteor.user()
//         if (lectureId && user) {
//             if ((user.profile.accountType == 'instructor') || (user.roles == 'admin')){
//                 return Audios.collection.find({
//                     "meta.lectureId": lectureId
//                 })
//             } else {
//                 return Audios.collection.find({
//                     'userId': user._id,
//                     'meta.lectureId': lectureId
//                 })
//             }
//         }
//     })
//     Audios.deny({
//         update() { return true },
//         remove() { return true }
//     })
// }