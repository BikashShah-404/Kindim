import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    profilePic: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    forgetPasswordToken: {
      type: String,
      default: null,
    },
    forgetPasswordTokenExpires: {
      type: Date,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  this.password = await bcryptjs.hash(this.password, 10);
});

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.isPasswordCorrect = function (password) {
  return bcryptjs.compareSync(password, this.password);
};

export const User = mongoose.model("User", userSchema);
