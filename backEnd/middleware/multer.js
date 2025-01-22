import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Get the current directory (__dirname equivalent in ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        // Provide the upload directory
        callback(null, uploadDir);
    },
    filename: function (req, file, callback) {
        // Generate a unique file name
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + path.extname(file.originalname));
    },
});

// File filter to allow only specific types (optional)
const fileFilter = (req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error("Invalid file type. Only JPEG and PNG are allowed."));
    }
};

// Multer upload configuration
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

export default upload;
