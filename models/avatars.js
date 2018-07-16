const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Avatar Schema
var AvatarsSchema = new SimpleSchema({
    name: {
        type: String,
        unique: true
    },
    url: {
        type: String
    },
    createdAt: {
        type: Date,
        label: 'Created At',
        defaultValue: new Date()
    }
});


// avatar METHODS

// base function if one is needed later
coursesSchema.methods.methodName = function(parameter) {
    return ;
};


// Export the avatar model.
module.exports = mongoose.model('vr-classromm-avatars', avatarsSchema);

//from meteor
// if (Meteor.isServer) {
// 	Meteor.publish('Avatars', function () {
// 		return Avatars.find({})
// 	})
// 	Avatars.deny({
// 		update() { return true },
// 		remove() { return true }
// 	})
// }