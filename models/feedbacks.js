const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var feedbackSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
	lastname: {
        type: String,
        required: true
    },
    telnum: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: false
    },
    message: {
    	type: String,
        required: false
    }
}, {
    timestamps: true
});


var Feedbacks = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedbacks;