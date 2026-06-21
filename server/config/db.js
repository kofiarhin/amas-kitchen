const mongoose = require("mongoose");
const { getConfig } = require("./env");

const connectDB = async () => {
  const connection = await mongoose.connect(getConfig().mongoUri);
  console.log("connected to database:", connection.connection.host);

  return connection;
};

module.exports = connectDB;
