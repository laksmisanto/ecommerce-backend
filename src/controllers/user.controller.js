import cookieParser from "cookie-parser";
import { User } from "../models/user.model.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};
const userRegister = async (req, res) => {
  let error = {};
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    addressOne,
    addressTwo,
    city,
    postCode,
    division,
    district,
    password,
    refreshToken,
  } = req.body;

  if (
    [
      firstName,
      lastName,
      email,
      phoneNumber,
      addressOne,
      addressTwo,
      city,
      postCode,
      division,
      district,
      password,
    ].some((field) => field?.trim() === "")
  ) {
    error.message = "please fill all field";
    res.status(401).send(error);
  }

  const exitingUser = await User.findOne({ email });

  if (exitingUser) {
    error.message = "already have a account";
    res.status(400).send(error);
  }

  const createUser = await User.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    addressOne,
    addressTwo,
    city,
    postCode,
    division,
    district,
    password,
  });

  if (!createUser) {
    error.message = "something went wrong";
    res.status(400).send(error);
  }
  const finalUserData = await User.findById(createUser._id).select(
    "-password -refreshToken"
  );
  res.status(200).json({
    message: "user create successful",
    data: finalUserData,
  });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const error = {};

  if ([email, password].some((field) => field?.trim() === "")) {
    error.message = "all field are required";
    req.status(400).send(error);
  }

  const user = await User.findOne({ email });
  if (!user) {
    error.message = "wrong auth credential";
    res.status(400).send(error);
  }
  const passwordCheck = user.isPasswordCorrect(password);

  if (!passwordCheck) {
    error.message = "wrong auth credential";
    res.status(400).send(error);
  }
  const { accessToken, refreshToken } = generateAccessTokenAndRefreshToken(
    user._id
  );
  const option = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookies("accessToken", accessToken, option)
    .cookies("refreshToken", refreshToken, option)
    .json({
      message: "user login successfully",
      data: {
        accessToken,
        refreshToken,
      },
    });
};

const userLogout = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    }
  );
  const option = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookies("accessToken", option)
    .cookies("refreshToken", option)
    .json({
      message: "user logout successfully",
    });
};

export { userRegister, userLogin, userLogout };
