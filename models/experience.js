const mongoose = require("mongoose")

const experienceSchema = mongoose.Schema({
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

const experienceModel = mongoose.model('experience', experienceSchema)
module.exports = experienceModel