const experienceModel = require("../models/experience");
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: "dkzby6kvb",
    api_key: "996867418246358",
    api_secret: "0CkJzRqGRNB7kulUzw-nmqZEWXk",
});
class ExperienceController {
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
                    folder: 'experience'
                })
            const experience = await experienceModel.create({
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
                experience: experience
            });
        } catch (error) {
            console.error("Error inserting experience:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong",
                error: error.message,
            });
        }
    };

    static display = async (req, res) => {
        try {
            const experience = await experienceModel.find();
            return res.status(200).json({
                success: true,
                message: "Data Displayed Successfully",
                experience, // plural, clearer
            });
        } catch (error) {
            console.error("Error fetching experience:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while fetching experiece",
                error: error.message,
            });
        }
    };

    static view = async (req, res) => {
        try {
            const id = req.params.id;
            const experience = await experienceModel.findById(id);

            if (!experience) {
                return res.status(404).json({
                    success: false,
                    message: "experience not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Event data fetched successfully",
                experience,
            });
        } catch (error) {
            console.error("Error fetching event by ID:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while fetching the event",
                error: error.message,
            });
        }
    };

    static delete = async (req, res) => {
        try {
            const { id } = req.params;

            // Find and delete the event
            const experience = await experienceModel.findByIdAndDelete(id);

            if (!experience) {
                return res.status(404).json({
                    success: false,
                    message: 'experiece not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'experiece deleted successfully',
                experiece: experience,
            });
        } catch (error) {
            console.error('Error deleting event:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Internal server error while deleting the event',
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
                    folder: 'experience',
                });

                updatedData.image = {
                    public_id: mediaupload.public_id,
                    url: mediaupload.secure_url,
                };
            }

            const updated = await experienceModel.findByIdAndUpdate(id, updatedData, { new: true });

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'experience not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'experience updated successfully',
                experience: updated,
            });
        } catch (error) {
            console.error('experiece error:', error);
            return res.status(500).json({
                success: false,
                message: 'Something went wrong',
                error: error.message,
            });
        }
    };

}
module.exports = ExperienceController