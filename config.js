require('dotenv').config()

exports.PORT = process.env["PORT"] || 4201;
exports.MONGODB_URI = process.env["MONGODB_URI"];
exports.CLOUDINARY_CLOUD_NAME = process.env['CLOUDINARY_CLOUD_NAME']
exports.CLOUDINARY_API_SECRET = process.env['CLOUDINARY_API_SECRET']
exports.CLOUDINARY_API_KEY = process.env['CLOUDINARY_API_KEY']
