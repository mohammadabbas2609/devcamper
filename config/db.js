const mongoose = require("mongoose");

const dbConnect = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  console.log(`connected to mongoDB host : ${conn.connection.host}`.bgMagenta);
};

module.exports = dbConnect;
