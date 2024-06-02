const mongoose = require("mongoose");

exports.mongooseConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      connectTimeoutMS: process.env.MONGODB_CONNECTION_TIMEOUT,
    });
  } catch (error) {
    throw new Error(error);
  }
};
