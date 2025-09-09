const mongoose = require('mongoose');
const local_url = "mongodb+srv://rohitkushwah6109744:ram123@cluster0.uh5u4.mongodb.net/pninfosys-company?retryWrites=true&w=majority&appName=Cluster0";
// const live_url = "mongodb+srv://rohitkushwah6109744:ram123@cluster0.uh5u4.mongodb.net/Pninfosys-company?retryWrites=true&w=majority&appName=Cluster0";
// local_url="mongodb://127.0.0.1:27017/pninfosys"

const connectDB = async () => {
    return mongoose.connect(local_url)
        .then(() => {
            console.log('Connected to the database');
        }).catch((error) => {
            console.log(error)
        })

}
module.exports = connectDB