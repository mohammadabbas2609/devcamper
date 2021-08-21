const mongoose = require("mongoose");
const { isURL, isEmail } = require("validator");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add name of bootcamp"],
      unique: true,
      trim: true,
      maxlength: [50, "Name should not exceed 50 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
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

// Creating Bootcamp slug from the name
BootcampSchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});

// Geocode and create location field
BootcampSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);

  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    zipcode: loc[0].zipcode,
    state: loc[0].stateCode,
    country: loc[0].countryCode,
  };

  // Dont saving address in database
  this.address = undefined;
  next();
});

const BootcampModel = new mongoose.model("bootcamp", BootcampSchema);

module.exports = BootcampModel;
