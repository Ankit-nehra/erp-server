import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["Academic", "Sports", "Cultural", "Other"],
      default: "Academic",
    },

    studentName: String,

    studentClass: String,

    image: {
      type: String,
      default: "",
    },

    public_id: {
      type: String,
      default: "",
    },

    achievementDate: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Achievement", achievementSchema);