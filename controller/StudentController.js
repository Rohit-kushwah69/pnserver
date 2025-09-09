const studentModel = require("../models/student");
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: "dkzby6kvb",
    api_key: "996867418246358",
    api_secret: "0CkJzRqGRNB7kulUzw-nmqZEWXk",
});
class StudentController {
    static insert = async (req, res) => {
        try {
            const { title, description } = req.body;

            if (!title || !description) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required",
                });
            }
            const file = req.files.image;
            const mediaupload = await cloudinary.uploader.upload(
                file.tempFilePath,
                {
                    folder: 'student'
                })
            const student = await studentModel.create({
                title,
                description,
                image: {
                    public_id: mediaupload.public_id,
                    url: mediaupload.secure_url
                }
            });
            return res.status(201).json({
                success: true,
                message: "Data Inserted Successfully",
                student: student
            });
        } catch (error) {
            console.error("Error inserting student:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong",
                error: error.message,
            });
        }
    };

    static display = async (req, res) => {
        try {
            const student = await studentModel.find();
            return res.status(200).json({
                success: true,
                message: "Data Displayed Successfully",
                student, // plural, clearer
            });
        } catch (error) {
            console.error("Error fetching student:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while fetching student",
                error: error.message,
            });
        }
    };

    static view = async (req, res) => {
        try {
            const id = req.params.id;
            const student = await studentModel.findById(id);

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: "student not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "student data fetched successfully",
                student,
            });
        } catch (error) {
            console.error("Error fetching event by ID:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while fetching the student",
                error: error.message,
            });
        }
    };

    static delete = async (req, res) => {
        try {
            const { id } = req.params;

            // Find and delete the event
            const student = await studentModel.findByIdAndDelete(id);

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'student not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Event deleted successfully',
                student: student,
            });
        } catch (error) {
            console.error('Error deleting student:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Internal server error while deleting the student',
                error: error.message,
            });
        }
    };

    static update = async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description } = req.body;

            const updatedData = {
                title,
                description,
            };

            // ✅ Check if a new image is uploaded
            if (req.files && req.files.image) {
                const file = req.files.image;
                const mediaupload = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'student',
                });

                updatedData.image = {
                    public_id: mediaupload.public_id,
                    url: mediaupload.secure_url,
                };
            }

            const updated = await studentModel.findByIdAndUpdate(id, updatedData, { new: true });

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'student not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'student updated successfully',
                student: updated,
            });
        } catch (error) {
            console.error('student error:', error);
            return res.status(500).json({
                success: false,
                message: 'Something went wrong',
                error: error.message,
            });
        }
    };

}
module.exports = StudentController