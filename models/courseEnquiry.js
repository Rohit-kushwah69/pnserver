const mongoose = require('mongoose')

const courseEnquirySchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
    },
    qualification: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
    preferredBatch: {
        type: String,
        enum: ["Morning", "Evening", "Weekend"],
        required: true,
    },
    modeOfLearning: {
        type: String,
        enum: ["Online", "Offline", "Hybrid"],
        required: true,
    },
    message: {
        type: String,
        trim: true,
    },
}, { timestamps: true })
const courseEnquiryModel = mongoose.model('CourseEnquiry', courseEnquirySchema);
module.exports = courseEnquiryModel