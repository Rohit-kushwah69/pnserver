const cloudinary = require("cloudinary");
const sliderModel = require("../models/slider");

cloudinary.config({
  cloud_name: "dkzby6kvb",
  api_key: "996867418246358",
  api_secret: "0CkJzRqGRNB7kulUzw-nmqZEWXk",
});

class SliderController {
  static sliderInsert = async (req, res) => {
    try {
      const { title, subtitle } = req.body;
      if (!title || !subtitle) {
        return res.status(400).json({ success: false, message: 'All Fields Are Required!!' });
      }
      const file = req.files.image;
      const mediaupload = await cloudinary.uploader.upload(file.tempFilePath, { folder: 'slider' });
      const sliderdata = await sliderModel.create({
        title,
        subtitle,
        image: {
          public_id: mediaupload.public_id,
          url: mediaupload.secure_url,
        },
      });
      return res.status(201).json({ success: true, message: 'slider created successfully', data: sliderdata });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: 'Create API error' });
    }
  };

  static sliderDisplay = async (req, res) => {
    try {
      const slider = await sliderModel.find();
      return res.status(200).json({
        success: true,
        message: 'Slides fetched successfully',
        slides: slider   // ✅ must be `slides`, not `data`
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Display API error',
        error: error.message
      });
    }
  };

  static sliderView = async (req, res) => {
    try {
      const id = req.params._id;
      const slider = await sliderModel.findById(id);
      return res.status(200).json({ success: true, message: "slider displayed Successfully", slider });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  static sliderDelete = async (req, res) => {
    try {
      const id = req.params._id;
      const slider = await sliderModel.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: "slider deleted Successfully", slider });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  static sliderUpdate = async (req, res) => {
    try {
      const { _id } = req.params;
      const { title, subtitle } = req.body;

      const updatedData = {
        title,
        subtitle,
      };

      // Check if a new image is uploaded
      if (req.files && req.files.image) {
        const file = req.files.image;
        const mediaupload = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'slider'
        });

        updatedData.image = {
          public_id: mediaupload.public_id,
          url: mediaupload.secure_url,
        };
      }

      const updated = await sliderModel.findByIdAndUpdate(_id, updatedData, { new: true });

      return res.status(200).json({
        success: true,
        message: 'Slider updated successfully',
        data: updated,
      });
    } catch (error) {
      console.error('Update error:', error);
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: error.message,
      });
    }
  };



}

module.exports = SliderController;