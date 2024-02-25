import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyUser = async (req, res, next) => {
  let error;

  try {
    const token =
      req.cookies?.accessToken || req.header.authorization?.split("")[1];
    if (!token) {
      error.message = "Unauthorize access";
      res.status(400).send(error);
    }
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, decoded) {
        return decoded;
      }
    );
    const user = await User.findById(decodedToken._id).select(
      "-password, _refreshToken"
    );
    if (!user) {
      error.message = "invalid token";
      res.status(400).send(error);
      req.user = user;
      next();
    }
  } catch (error) {
    console.log("This is auth.middleware error : ", error);
  }
};
export default verifyUser;
