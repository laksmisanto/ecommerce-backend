"use Client";
import { User } from "../models/user.model.js";
import mailProvider from "../utils/mailProvider.js";
import mailVerificationTemplate from "../utils/template/mailVerification.template.js";
import randomNumber from "../utils/randomNumber.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

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
    let roleValue = role;
    if (!roleValue) {
      roleValue = "customer";
    }
    const otp = randomNumber(4);
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
      verifiedOtp: otp,
      role: roleValue,
    });

    if (!createUser) {
      error.message = "something went wrong";
      res.status(400).send(error);
    }
    const finalUserData = await User.findById(createUser._id).select(
      "-password -refreshToken"
    );
    const mailRes = await mailProvider(
      email,
      "Oreby ecommerce",
      otp,
      mailVerificationTemplate
    );
    setTimeout(async () => {
      await User.findOneAndUpdate(
        { email },
        { $set: { verifiedOtp: "" } },
        { new: true }
      );
      console.log("your OTP time is out");
    }, 100000);
    console.log("mail response : ", mailRes);
    console.log(finalUserData);

    res.status(200).json({
      message: "user create successful",
      data: finalUserData,
    });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log("user login email and password", email, password);
  const error = {};

  if ([email, password].some((field) => field?.trim() === "")) {
    error.message = "all field are required";
    res.status(400).send(error);
    return;
  }

  const user = await User.findOne({ email });
  console.log("login user : ", user);
  if (!user) {
    error.message = "wrong auth credential email";
    res.status(400).send(error);
    return;
  }
  const passwordCheck = await user.isPasswordCorrect(password);

  console.log("user login password : ", passwordCheck);

  if (!passwordCheck) {
    error.message = "wrong auth credential password";
    res.status(400).send(error);
    return;
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);
  const option = {
    httpOnly: true,
    secure: true,
  };
  console.log("accessToken", accessToken);
  console.log("refreshToken", refreshToken);
  res
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json({
      message: "user login successfully",
      data: {
        accessToken,
        refreshToken,
        role: user.role,
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

const emailVerification = async (req, res) => {
  let error = {};
  const { email, otp } = req.body;

  const isValidUser = await User.findOne({ email });

  if (!isValidUser) {
    error.message = "invalid user";
    res.status(400).send(error);
  }

  if (isValidUser.verifiedOtp == otp) {
    const verifiedUser = await User.findOneAndUpdate(
      { email },
      { $set: { isVerified: true, verifiedOtp: "" } },
      { new: true }
    );
    res.status(201).json({
      data: verifiedUser,
    });
  }
};

const userList = async (req, res) => {
  const userListData = await User.find();
  res.send(userListData);
};

export {
  userRegister,
  userLogin,
  userLogout,
  changePassword,
  updateProfile,
  emailVerification,
  userList,
};
