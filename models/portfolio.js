const mongoose = require('mongoose')

const portfolioSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    link: {
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
    }
}, { timestamps: true });

const portfolioModel = mongoose.model('portfolio', portfolioSchema);
module.exports = portfolioModel