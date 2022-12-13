const mongoose = require("mongoose");
const { MONGODB_URI } = require("../config.js");

exports.connectToDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGODB_URI);
    console.log("Mongodb connected");
  } catch (error) {
    console.error(error);
  }
};
