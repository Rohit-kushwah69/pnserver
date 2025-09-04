const placeModel = require('../models/place')
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: "dkzby6kvb",
    api_key: "996867418246358",
    api_secret: "0CkJzRqGRNB7kulUzw-nmqZEWXk",
});

class PlaceController {
    static placeinsert = async (req, res) => {
        try {
            // console.log(req.body);
            const { name, image, position } = req.body;
            const result = await placeModel.create({
                name, image, position
            });
            return res.status(201).json({
                message: "Data Inserted Successfully",
                data: result,
            });
        } catch (error) {
            console.log(error)
        }
    }
    static placedisplay = async (req, res) => {
        try {
            const place = await placeModel.find();
            return res.status(200).json({
                success: true,
                message: "Data Displayed Successfully",
                place,
            });
        } catch (error) {
            console.log(error)
        }
    }
    static placeview = async (req, res) => {
        try {
            const id = req.params.id;
            const place = await placeModel.findById(id);
            return res.status(200).json({
                success: true,
                message: "Data Displayed Successfully",
                place,
            });
        } catch (error) {
            console.log(error)
        }
    }
    static placedelete = async (req, res) => {
        try {
            const id = req.params.id;
            const place = await placeModel.findByIdAndDelete(id);
            return res.status(200).json({
                success: true,
                message: "Data Deleted Successfully",
                place,
            });
        } catch (error) {
            console.log(error)
        }
    }
    static placeupdate = async (req, res) => {
        try {
            // console.log(req.body);
            const id = req.params.id;
            const { name, image, position } = req.body;
            await placeModel.findByIdAndUpdate(id, {
                name, image, position
            });
            return res.status(201).json({
                success: true,
                message: "Data Updated Successfully",
            });
        } catch (error) {
            console.log(error)
        }

    }
}
module.exports = PlaceController