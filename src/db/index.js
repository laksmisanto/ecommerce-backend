import mongoose from "mongoose";
import { dbName } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${dbName}`
    );
    console.log("Mongodb Connected : ", connectionInstance.connection.host);
  } catch (error) {
    console.log("Mongodb Connection Error : ", error);
  }
};

export default connectDB;
