import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  image: String,       // Cloudinary URL
  public_id: String,   // Cloudinary public id
  category: String,
});

export default mongoose.model("Gallery", gallerySchema);