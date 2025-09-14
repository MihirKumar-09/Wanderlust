// Require the storage and cloudinary;
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configue Details setup
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Define storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "some-folder-name",
    allowerdFormat: ["png", "jpg", "jpeg"],
  },
});

// Export both storage and cloudinary;
module.exports = {
  cloudinary,
  storage,
};
