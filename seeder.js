const dotenv = require("dotenv");
const BootcampModel = require("./models/bootcampModel");
const CourseModel = require("./models/courseModel");
const UserModel = require("./models/userModel");
const fs = require("fs");
const colors = require("colors");
const dbConnect = require("./config/db");

dotenv.config({});

function readFile(filename) {
  return JSON.parse(
    fs.readFileSync(`./_data/${filename}`, { encoding: "utf-8" })
  );
}

// Data to Seed
const bootcamp = readFile("bootcamps.json");
const courses = readFile("courses.json");
const users = readFile("users.json");

async function importData() {
  await dbConnect();
  await UserModel.create(users);
  await BootcampModel.create(bootcamp);
  await CourseModel.create(courses);

  console.log("Data Imported".bold.green);
}
async function destroyData() {
  await dbConnect();
  await UserModel.deleteMany({});
  await BootcampModel.deleteMany({});
  await CourseModel.deleteMany({});

  console.log("Data destroyed".bold.red);
}

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  destroyData();
}
