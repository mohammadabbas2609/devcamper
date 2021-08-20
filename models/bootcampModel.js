const mongoose = require("mongoose");
const { isURL, isEmail } = require("validator");

const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add name of bootcamp"],
      unique: true,
      trim: true,
      maxlength: [50, "Name should not exceed 50 characters"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [500, "Description should no exceed 500 characters"],
    },
    website: {
      type: String,
      validate: [isURL, "Please enter valid website name"],
    },
    phone: {
      type: String,
      maxlength: [20, "Phone number should not excedd 20 characters"],
    },
    email: {
      type: String,
      validate: [isEmail, "Please enter a valid email"],
    },
    address: {
      type: String,
      required: [true, "Please enter address"],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      type: [String],
      required: [true, "Please mention careers"],
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
        "Other",
      ],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be atleast 1"],
      max: [10, "Rating cannot exceed more than 10"],
    },
    averageCost: {
      type: Number,
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGI: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const BootcampModel = new mongoose.model("bootcamp", BootcampSchema);

module.exports = BootcampModel;
