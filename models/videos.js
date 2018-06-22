const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var videoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    category: {
        type: String
    }
}, {
    timestamps: true
});


var Videos = mongoose.model('Video', videoSchema);

module.exports = Videos;
