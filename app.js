const express = require("express");
const app = express();
const port = 4000;
const web = require("./routes/web");
const connectDb = require("./database/connectDB");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Enable CORS for frontend connection
app.use(
  cors({
    origin: [
      // "http://localhost:3000",          // Next.js frontend local
      "https://pninfosys-it-company.vercel.app",  // Vercel deploy URL
      // "https://your-custom-domain.com"  // (agar apna domain connect karo to)
    ],
    credentials: true,
  })
);

// Enable cookie parser
app.use(cookieParser());

// Connect to database
connectDb();

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//  Enable image upload with temp files
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/", // Optional, but good to set
  })
);

// API Routes
app.use("/api", web);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
