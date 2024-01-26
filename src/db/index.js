import mongoose from "mongoose";
import { dbName } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${dbName}`
    );
    console.log("Mongodb Connected", connectionInstance.connection.host);
  } catch (error) {
    console.error("Mongodb Connection Failed", error);
  }
};

export default connectDB;
