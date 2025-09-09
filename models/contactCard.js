const mongoose = require('mongoose');

const contactCardSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
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
        },
    }
}, { timestamps: true });

const contactCardModel = mongoose.model('contactCard', contactCardSchema);
module.exports = contactCardModel;
