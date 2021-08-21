const dotenv = require("dotenv");
const BootcampModel = require("./models/bootcampModel");
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

async function importData() {
  await dbConnect();
  await BootcampModel.create(bootcamp);

  console.log("Data Imported".bold.green);
}
async function destroyData() {
  await dbConnect();
  await BootcampModel.deleteMany({});

  console.log("Data destroyed".bold.red);
}

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  destroyData();
}
