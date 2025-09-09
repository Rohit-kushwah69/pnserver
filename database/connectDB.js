const mongoose = require('mongoose');
// const local_url = "mongodb+srv://rohitkushwah6109744:ram123@cluster0.uh5u4.mongodb.net/pninfosys-company?retryWrites=true&w=majority&appName=Cluster0";
// const live_url = "mongodb+srv://rohitkushwah6109744:ram123@cluster0.uh5u4.mongodb.net/Pninfosys-company?retryWrites=true&w=majority&appName=Cluster0";
// local_url="mongodb://127.0.0.1:27017/pninfosys"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB