const learningModel = require('../models/learning')
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: "dkzby6kvb",
    api_key: "996867418246358",
    api_secret: "0CkJzRqGRNB7kulUzw-nmqZEWXk",
});
class learningController {
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
                    folder: 'learning'
                })
            const learning = await learningModel.create({
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
                learning: learning
            });
        } catch (error) {
            console.error("Error inserting learning:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong",
                error: error.message,
            });
        }
    };
    static display = async (req, res) => {
        try {
            const learning = await learningModel.find();
            return res.status(200).json({
                success: true,
                message: "Data Displayed Successfully",
                learning, // plural, clearer
            });
        } catch (error) {
            console.error("Error fetching learning:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while fetching learning",
                error: error.message,
            });
        }
    };
    static view = async (req, res) => {
        try {
            const id = req.params.id;
            const learning = await learningModel.findById(id);

            if (!learning) {
                return res.status(404).json({
                    success: false,
                    message: "learning not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "learning data fetched successfully",
                learning,
            });
        } catch (error) {
            console.error("Error fetching learning by ID:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while fetching the learning",
                error: error.message,
            });
        }
    };
    static delete = async (req, res) => {
        try {
            const id = req.params.id;
            const learning = await learningModel.findByIdAndDelete(id);
            if (!learning) {
                return res.status(404).json({
                    success: false,
                    message: "learning not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "learning deleted successfully",
                learning,
            });
        } catch (error) {
            console.error("Error deleting learning:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while deleting the learning",
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
                    folder: 'learning',
                });

                updatedData.image = {
                    public_id: mediaupload.public_id,
                    url: mediaupload.secure_url,
                };
            }

            const updated = await learningModel.findByIdAndUpdate(id, updatedData, { new: true });

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'learning not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'learning updated successfully',
                learning: updated,
            });
        } catch (error) {
            console.error('learning error:', error);
            return res.status(500).json({
                success: false,
                message: 'Something went wrong',
                error: error.message,
            });
        }
    };
}
module.exports = learningController