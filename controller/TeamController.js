const teamModel = require('../models/team')
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: "dkzby6kvb",
    api_key: "996867418246358",
    api_secret: "0CkJzRqGRNB7kulUzw-nmqZEWXk",
});
class TeamController {
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
                    folder: 'team'
                })
            const team = await teamModel.create({
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
                team: team
            });
        } catch (error) {
            console.error("Error inserting event:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong",
                error: error.message,
            });
        }
    };
    static display = async (req, res) => {
        try {
            const team = await teamModel.find();
            return res.status(200).json({
                success: true,
                message: "Data Displayed Successfully",
                team, // plural, clearer
            });
        } catch (error) {
            console.error("Error fetching team:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while fetching team",
                error: error.message,
            });
        }
    };
    static view = async (req, res) => {
        try {
            const id = req.params.id;
            const team = await teamModel.findById(id);

            if (!team) {
                return res.status(404).json({
                    success: false,
                    message: "team not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "team data fetched successfully",
                team,
            });
        } catch (error) {
            console.error("Error fetching team by ID:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while fetching the team",
                error: error.message,
            });
        }
    };
    static delete = async (req, res) => {
        try {
            const id = req.params.id;
            const team = await teamModel.findByIdAndDelete(id);
            if (!team) {
                return res.status(404).json({
                    success: false,
                    message: "team not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "team deleted successfully",
                team,
            });
        } catch (error) {
            console.error("Error deleting team:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while deleting the team",
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
                    folder: 'team',
                });

                updatedData.image = {
                    public_id: mediaupload.public_id,
                    url: mediaupload.secure_url,
                };
            }

            const updated = await teamModel.findByIdAndUpdate(id, updatedData, { new: true });

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'team not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'team updated successfully',
                team: updated,
            });
        } catch (error) {
            console.error('team error:', error);
            return res.status(500).json({
                success: false,
                message: 'Something went wrong',
                error: error.message,
            });
        }
    };
}
module.exports = TeamController