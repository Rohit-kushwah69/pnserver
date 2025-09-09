const mongoose = require("mongoose")

const learningSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    },
}, { timestamps: true });

const learningModel = mongoose.model('learning', learningSchema)
module.exports = learningModel