const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    bootcamp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bootcamp",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please enter title"],
      max: [25, "title should not be more than 20 characters"],
    },
    text: {
      type: String,
      required: [true, "Please enter description"],
      max: [200, "description should not be more than 200 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Please enter rating for bootcamp"],
      min: [1, "Rating must be atleast 1"],
      max: [10, "Rating cannot exceed more than 10"],
    },
  },
  { timestamps: true }
);

// Protect user from submitting more than one rating
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Static method to get avg of rating for the bootcamp
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    await this.model("bootcamp").findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating.toFixed(2),
    });
  } catch (error) {
    console.error(error.message);
  }
};

// Call getAverageRating after save
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.bootcamp);
});

// Call getAverageRating before remove
ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.bootcamp);
});

const ReviewModel = new mongoose.model("review", ReviewSchema);

module.exports = ReviewModel;
