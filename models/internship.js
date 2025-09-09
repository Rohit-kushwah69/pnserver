const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            trim: true,
        },
        internshipDomain: {
            type: String,
            required: true,
        },
        internshipType: {
            type: String,
            enum: ["Full-time", "Part-time", "Remote", "Onsite"],
            default: "Full-time",
        },
        skills: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ["Pending", "Selected", "Rejected"],
            default: "Pending",
        },
        resume: {
            public_id: { type: String, required: true },
            url: { type: String, required: true },
        }

    },
    {
        timestamps: true,
    }
);

const internshipModel = mongoose.model("internship", internshipSchema);
module.exports = internshipModel;
