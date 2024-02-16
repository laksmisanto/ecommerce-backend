import { User } from "../models/user.model.js";

export const userRegister = async (req, res) => {
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
  console.log(exitingUser);
};
