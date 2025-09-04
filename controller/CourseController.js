const cloudinary = require("cloudinary");
const courseModel = require("../models/course");

cloudinary.config({
    cloud_name: "dkzby6kvb",
    api_key: "996867418246358",
    api_secret: "0CkJzRqGRNB7kulUzw-nmqZEWXk",
});

class CourseController {
    static courseInsert = async (req, res) => {
        try {
            const { title, description, price, duration, level } = req.body;
            if (!title || !description || !price || !duration || !level) {
                return res.status(400).json({
                    success: false,
                    message: 'all field are required!!'
                })
            }
            const file = req.files.image;
            const mediaupload = await cloudinary.uploader.upload(
                file.tempFilePath, {
                folder: 'course'
            })
            const coursedata = await courseModel.create({
                title,
                description,
                price,
                duration,
                level,
                image: {
                    public_id: mediaupload.public_id,
                    url: mediaupload.secure_url
                },
            })
            return res.status(201).json({
                success: true,
                message: 'course create successfully',
                data: coursedata,
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: 'Create API error' });
        }
    }
    static courseDisplay = async (req, res) => {
        try {
            const course = await courseModel.find();
            return res.status(201).json({
                success: true,
                message: "display api successfully",
                courses: course
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: 'display api error',
                error: error.message
            })

        }
    }
    static viewCourse = async (req, res) => {
        try {
            const id = req.params.id;
            const course = await courseModel.findById(id);
            return res.status(200).json({ success: true, message: "course displayed Successfully", course });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    }
    static courseDelete = async (req, res) => {
        try {
            const id = req.params.id;
            const slider = await courseModel.findByIdAndDelete(id);
            return res.status(200).json({ success: true, message: "course deleted Successfully", slider });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    }
    static courseUpdate = async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, price, duration, level } = req.body;

            const updatedData = {
                title,
                description,
                price,
                duration,
                level,
            };

            // ✅ Check if a new image is uploaded
            if (req.files && req.files.image) {
                const file = req.files.image;
                const mediaupload = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'course',
                });

                updatedData.image = {
                    public_id: mediaupload.public_id,
                    url: mediaupload.secure_url,
                };
            }

            const updated = await courseModel.findByIdAndUpdate(id, updatedData, { new: true });

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Course updated successfully',
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
module.exports = CourseController