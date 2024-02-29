import mongoose from "mongoose";

const url = "mongodb://127.0.0.1:27017/mongooseacl";

try {
  mongoose.connect(url);
  console.log("Database connected...");
} catch (error) {
  console.error(error);
}

export { mongoose };
