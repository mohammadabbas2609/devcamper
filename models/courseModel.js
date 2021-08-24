const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
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
      trim: true,
      required: [true, "Please add course title is required"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    weeks: {
      type: String,
      required: [true, "Please add number of weeks"],
    },
    tution: {
      type: Number,
      required: [true, "Please add a tution cost"],
    },
    minimumSkill: {
      type: String,
      required: [true, "Please add minimum skills"],
      enum: ["beginner", "intermediate", "advanced"],
    },
    scholarshipAvailable: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Static method to get avg of course tutions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tution" },
      },
    },
  ]);

  try {
    await this.model("bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (error) {
    console.error(error.message);
  }
};

// Call getAverageCost after save
CourseSchema.post("save", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
CourseSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.bootcamp);
});
const CourseModel = new mongoose.model("course", CourseSchema);

module.exports = CourseModel;
