import { User } from "../models/user.model.js";
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

  console.log(createUser);

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
};

export { userRegister };
