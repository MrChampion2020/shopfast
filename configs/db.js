// const mongoose = require("mongoose");
// require("dotenv").config();

// module.exports = async () => {
//   return mongoose.connect(process.env.MONGODB_URI);
// };

const mongoose = require("mongoose");
require("dotenv").config();

module.exports = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connection successful!");
    return connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit the process with failure code
  }
};

