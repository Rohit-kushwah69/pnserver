const contactCardModel = require('../models/contactCard')
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: "dkzby6kvb",
    api_key: "996867418246358",
    api_secret: "0CkJzRqGRNB7kulUzw-nmqZEWXk",
});
class ContactCardController {
    static insert = async (req, res) => {
        try {
            const { title, subtitle } = req.body;

            if (!title || !subtitle) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required",
                });
            }
            const file = req.files.image;
            const mediaupload = await cloudinary.uploader.upload(
                file.tempFilePath,
                {
                    folder: 'contactCard'
                })
            const contactCard = await contactCardModel.create({
                title,
                subtitle,
                image: {
                    public_id: mediaupload.public_id,
                    url: mediaupload.secure_url
                }
            });
            return res.status(201).json({
                success: true,
                message: "Data Inserted Successfully",
                contactCard: contactCard
            });
        } catch (error) {
            console.error("Error inserting contactCard:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong",
                error: error.message,
            });
        }
    };

    static display = async (req, res) => {
        try {
            const contactCard = await contactCardModel.find();
            return res.status(200).json({
                success: true,
                message: "Data Displayed Successfully",
                contactCard, // plural, clearer
            });
        } catch (error) {
            console.error("Error fetching contactCard:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while fetching contactCard",
                error: error.message,
            });
        }
    };

    static view = async (req, res) => {
        try {
            const id = req.params.id;
            const contactCard = await contactCardModel.findById(id);

            if (!contactCard) {
                return res.status(404).json({
                    success: false,
                    message: "contactCard not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "contactCard data fetched successfully",
                contactCard,
            });
        } catch (error) {
            console.error("Error fetching contactCard by ID:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while fetching the contactCard",
                error: error.message,
            });
        }
    };

    static delete = async (req, res) => {
        try {
            const { id } = req.params;

            // Find and delete the event
            const contactCard = await contactCardModel.findByIdAndDelete(id);

            if (!contactCard) {
                return res.status(404).json({
                    success: false,
                    message: 'contactCard not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'contactCard deleted successfully',
                contactCard: contactCard,
            });
        } catch (error) {
            console.error('Error deleting contactCard:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Internal server error while deleting the contactCard',
                error: error.message,
            });
        }
    };

    static update = async (req, res) => {
        try {
            const { id } = req.params;
            const { title, subtitle } = req.body;

            const updatedData = {
                title,
                subtitle,
            };

            // ✅ Check if a new image is uploaded
            if (req.files && req.files.image) {
                const file = req.files.image;
                const mediaupload = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'contactCard',
                });

                updatedData.image = {
                    public_id: mediaupload.public_id,
                    url: mediaupload.secure_url,
                };
            }

            const updated = await contactCardModel.findByIdAndUpdate(id, updatedData, { new: true });

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'contactCard not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'contactCard updated successfully',
                contactCard: updated,
            });
        } catch (error) {
            console.error('contactCard error:', error);
            return res.status(500).json({
                success: false,
                message: 'Something went wrong',
                error: error.message,
            });
        }
    };

}
module.exports = ContactCardController