const eventModel = require("../models/event");

const cloudinary = require("cloudinary");
cloudinary.config({
    cloud_name: "dkzby6kvb",
    api_key: "996867418246358",
    api_secret: "0CkJzRqGRNB7kulUzw-nmqZEWXk",
});
class EventController {
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
                    folder: 'event'
                })
            const event = await eventModel.create({
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
                event: event
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
            const event = await eventModel.find();
            return res.status(200).json({
                success: true,
                message: "Data Displayed Successfully",
                event, // plural, clearer
            });
        } catch (error) {
            console.error("Error fetching events:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while fetching events",
                error: error.message,
            });
        }
    };

    static view = async (req, res) => {
        try {
            const id = req.params.id;
            const event = await eventModel.findById(id);

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: "Event not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Event data fetched successfully",
                event,
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
            const event = await eventModel.findByIdAndDelete(id);

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Event not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Event deleted successfully',
                event: event,
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
                    folder: 'event',
                });

                updatedData.image = {
                    public_id: mediaupload.public_id,
                    url: mediaupload.secure_url,
                };
            }

            const updated = await eventModel.findByIdAndUpdate(id, updatedData, { new: true });

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'event not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'event updated successfully',
                event: updated,
            });
        } catch (error) {
            console.error('event error:', error);
            return res.status(500).json({
                success: false,
                message: 'Something went wrong',
                error: error.message,
            });
        }
    };

}
module.exports = EventController