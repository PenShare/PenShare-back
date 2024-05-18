const mongoose = require("mongoose");

exports.mongooseConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      connectTimeoutMS: process.env.MONGODB_CONNECTION_TIMEOUT,
    });
    console.log("DB connected successfully");
  } catch (error) {
    console.log(`DB connected error :, ${error} `);
    throw new Error(error);
  }
};
