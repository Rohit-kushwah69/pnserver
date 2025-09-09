const mongoose = require('mongoose')

const placeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
}, { timestamps: true });

const placeModel = mongoose.model('place', placeSchema);
module.exports = placeModel