const mongoose = require('mongoose')

const technologySchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
}, { timestamps: true });

const technologyModel = mongoose.model('technology', technologySchema);
module.exports = technologyModel