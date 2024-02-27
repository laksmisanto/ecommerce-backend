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
    role,
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
  } else {
    let roleValue = value;
    if (!roleValue) {
      roleValue = "customer";
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
      role: roleValue,
    });

    if (!createUser) {
      error.message = "something went wrong";
      res.status(400).send(error);
    }
    const finalUserData = await User.findById(createUser._id).select(
      "-password -refreshToken"
    );
    console.log(finalUserData);
    res.status(200).json({
      message: "user create successful",
      data: finalUserData,
    });
  }
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

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    (error.message = "All field are required"), res.status(400).send(error);
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        password: newPassword,
      },
    },
    {
      new: true,
    }
  );
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    message: "password updated successfully",
  });
};

const updateProfile = async (req, res) => {
  let error = {};
  const {
    firstName,
    lastName,
    phoneNumber,
    addressOne,
    addressTwo,
    city,
    postCode,
    division,
    district,
    refreshToken,
    role,
  } = req.body;

  if (
    [
      firstName,
      lastName,
      phoneNumber,
      addressOne,
      addressTwo,
      city,
      postCode,
      division,
      district,
    ].some((field) => field?.trim() === "")
  ) {
    error.message = "please fill all field";
    res.status(401).send(error);
  }
  let roleValue = role;
  if (!roleValue) {
    roleValue = "customer";
  }
  const updateUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        firstName,
        lastName,
        phoneNumber,
        addressOne,
        addressTwo,
        city,
        postCode,
        division,
        district,
        refreshToken,
        role: roleValue,
      },
    },
    {
      new: true,
    }
  );
  updateUser
    .save({ validateBeforeSave: false })
    .select("-password -refreshToken");
  res.status(200).json({
    message: "user update successfully",
    data: updateUser,
  });
};

export { userRegister, userLogin, userLogout, changePassword, updateProfile };
