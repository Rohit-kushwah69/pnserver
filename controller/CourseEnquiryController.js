const courseEnquiryModel = require("../models/courseEnquiry");

class CourseEnquiryController {
    // Insert Enquiry
    static createEnquiry = async (req, res) => {
        try {
            const {
                firstName,
                lastName,
                phone,
                email,
                gender,
                qualification,
                experience,
                course,
                preferredBatch,
                modeOfLearning,
                message,
            } = req.body;

            if (!firstName || !phone || !email || !gender || !qualification || !experience || !course || !preferredBatch || !modeOfLearning) {
                return res.status(400).json({
                    success: false,
                    message: "All required fields must be provided!",
                });
            }

            const enquiry = await courseEnquiryModel.create({
                firstName,
                lastName,
                phone,
                email,
                gender,
                qualification,
                experience,
                course,
                preferredBatch,
                modeOfLearning,
                message,
            });

            return res.status(201).json({
                success: true,
                message: "Enquiry submitted successfully",
                data: enquiry,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Error while creating enquiry",
                error: error.message,
            });
        }
    };

    // Display all Enquiries
    static getAllEnquiries = async (req, res) => {
        try {
            const enquiries = await courseEnquiryModel.find().sort({ createdAt: -1 });
            return res.status(200).json({
                success: true,
                message: "Enquiries fetched successfully",
                data: enquiries,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Error while fetching enquiries",
                error: error.message,
            });
        }
    };

    // View single enquiry
    static getEnquiryById = async (req, res) => {
        try {
            const { id } = req.params;
            const enquiry = await courseEnquiryModel.findById(id);

            if (!enquiry) {
                return res.status(404).json({
                    success: false,
                    message: "Enquiry not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Enquiry fetched successfully",
                data: enquiry,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Error while fetching enquiry",
                error: error.message,
            });
        }
    };

    // Delete enquiry
    static deleteEnquiry = async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await courseEnquiryModel.findByIdAndDelete(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: "Enquiry not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Enquiry deleted successfully",
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Error while deleting enquiry",
                error: error.message,
            });
        }
    };

    // Update enquiry (e.g. admin update status/remarks)
    static updateEnquiry = async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const updated = await courseEnquiryModel.findByIdAndUpdate(id, updateData, { new: true });

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: "Enquiry not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Enquiry updated successfully",
                data: updated,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Error while updating enquiry",
                error: error.message,
            });
        }
    };
}

module.exports = CourseEnquiryController;
