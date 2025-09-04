const technologyModel = require('../models/technology')
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: "dkzby6kvb",
    api_key: "996867418246358",
    api_secret: "0CkJzRqGRNB7kulUzw-nmqZEWXk",
});
class TechnologyController {
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
                    folder: "technology"
                })
            const technology = await technologyModel.create({
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
                technology: technology
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
            const technology = await technologyModel.find();
            return res.status(200).json({
                success: true,
                message: "Data Displayed Successfully",
                technology, // plural, clearer
            });
        } catch (error) {
            console.error("Error fetching technology:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while fetching technology",
                error: error.message,
            });
        }
    };

    // static view = async (req, res) => {
    //     try {
    //         const id = req.params.id;
    //         const technology = await technologyModel.findById(id);

    //         if (!technology) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "technology not found",
    //             });
    //         } 

    //         return res.status(200).json({
    //             success: true,
    //             message: "technology data fetched successfully",
    //             technology,
    //         });
    //     } catch (error) {
    //         console.error("Error fetching technology by ID:", error);
    //         return res.status(500).json({
    //             success: false,
    //             message: "Something went wrong while fetching the technology",
    //             error: error.message,
    //         });
    //     }
    // };

     static view = async (req, res) => {
            try {
                const id = req.params.id;
                const technology = await technologyModel.findById(id);
                return res.status(200).json({ success: true, message: "technology displayed Successfully", technology });
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: "Something went wrong" });
            }
        }

    static delete = async (req, res) => {
        try {
            const id = req.params.id;
            const technology = await technologyModel.findByIdAndDelete(id);
            if (!technology) {
                return res.status(404).json({
                    success: false,
                    message: "technology not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "technology deleted successfully",
                technology,
            });
        } catch (error) {
            console.error("Error deleting technology:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while deleting the technology",
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
                    folder: 'technology',
                });

                updatedData.image = {
                    public_id: mediaupload.public_id,
                    url: mediaupload.secure_url,
                };
            }

            const updated = await technologyModel.findByIdAndUpdate(id, updatedData, { new: true });

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'technology not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'technology updated successfully',
                data: updated,
            });
        } catch (error) {
            console.error('technology error:', error);
            return res.status(500).json({
                success: false,
                message: 'Something went wrong',
                error: error.message,
            });
        }
    };


}
module.exports = TechnologyController