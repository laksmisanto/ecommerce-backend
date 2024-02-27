import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      index: true,
    },
    phoneNumber: {
      type: String,
      require: true,
    },
    addressOne: {
      type: String,
      require: true,
    },
    addressTwo: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      require: true,
    },
    postCode: {
      type: String,
      require: true,
    },
    division: {
      type: String,
      require: true,
    },
    district: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "editor", "customer"],
      default: customer,
    },
  },
  { timeStamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  await bcrypt.compare(password, this.password, (err, result) => {
    return result;
  });
};

userSchema.methods.generateAccessToken = async function () {
  await jwt.sign(
    {
      _id: this._id,
      _email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  await jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);
