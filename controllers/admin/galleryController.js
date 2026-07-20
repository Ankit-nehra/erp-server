import Gallery from "../../models/admin/Gallery.js";
import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";

// GET all images
export const getImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD image
export const addImage = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded"
      });
    }

    const uploadImage = () =>
      new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "gallery"
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier
          .createReadStream(req.file.buffer)
          .pipe(stream);

      });

    const result = await uploadImage();

    const gallery = await Gallery.create({
      image: result.secure_url,
      public_id: result.public_id,
      category: req.body.category,
    });

    res.status(201).json(gallery);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// DELETE image + file from server
export const deleteImage = async (req, res) => {

  const image = await Gallery.findById(req.params.id);

  if (!image)
    return res.status(404).json({
      message: "Not found"
    });

  await cloudinary.uploader.destroy(image.public_id);

  await image.deleteOne();

  res.json({
    message: "Deleted"
  });

};
