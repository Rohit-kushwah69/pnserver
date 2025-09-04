const portfolioModel = require('../models/portfolio')
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: "dkzby6kvb",
    api_key: "996867418246358",
    api_secret: "0CkJzRqGRNB7kulUzw-nmqZEWXk",
});

class PortfolioController {
    static insert = async (req, res) => {
        try {
            const { title, description, link } = req.body;

            if (!title || !description || !link) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required",
                });
            }
            const file = req.files.image;
            const mediaupload = await cloudinary.uploader.upload(
                file.tempFilePath,
                {
                    folder: 'portfolio'
                })
            const portfolio = await portfolioModel.create({
                title,
                description,
                link,
                image: {
                    public_id: mediaupload.public_id,
                    url: mediaupload.secure_url
                }
            });
            return res.status(201).json({
                success: true,
                message: "Data Inserted Successfully",
                portfolio: portfolio
            });
        } catch (error) {
            console.error("Error inserting portfolio:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong",
                error: error.message,
            });
        }
    };
    static display = async (req, res) => {
        try {
            const portfolio = await portfolioModel.find();
            return res.status(200).json({
                success: true,
                message: "Data Displayed Successfully",
                portfolio, // plural, clearer
            });
        } catch (error) {
            console.error("Error fetching portfolio:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while fetching portfolio",
                error: error.message,
            });
        }
    };
    static view = async (req, res) => {
        try {
            const id = req.params.id;
            const portfolio = await portfolioModel.findById(id);

            if (!portfolio) {
                return res.status(404).json({
                    success: false,
                    message: "portfolio not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "portfolio data fetched successfully",
                portfolio,
            });
        } catch (error) {
            console.error("Error fetching portfolio by ID:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while fetching the portfolio",
                error: error.message,
            });
        }
    };
    static delete = async (req, res) => {
        try {
            const id = req.params.id;
            const portfolio = await portfolioModel.findByIdAndDelete(id);
            if (!portfolio) {
                return res.status(404).json({
                    success: false,
                    message: "Portfolio not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Portfolio deleted successfully",
                portfolio,
            });
        } catch (error) {
            console.error("Error deleting portfolio:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while deleting the portfolio",
                error: error.message,
            });
        }
    };
    static update = async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, link } = req.body;

            const updatedData = {
                title,
                description,
                link
            };

            // ✅ Check if a new image is uploaded
            if (req.files && req.files.image) {
                const file = req.files.image;
                const mediaupload = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'portfolio',
                });

                updatedData.image = {
                    public_id: mediaupload.public_id,
                    url: mediaupload.secure_url,
                };
            }

            const updated = await portfolioModel.findByIdAndUpdate(id, updatedData, { new: true });

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'portfolio not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'portfolio updated successfully',
                data: updated,
            });
        } catch (error) {
            console.error('portfolio error:', error);
            return res.status(500).json({
                success: false,
                message: 'Something went wrong',
                error: error.message,
            });
        }
    };

}
module.exports = PortfolioController