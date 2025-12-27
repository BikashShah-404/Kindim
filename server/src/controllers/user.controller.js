import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found!!!");

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({
    validateBeforeSave: false,
  });

  return { accessToken, refreshToken };
};

const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (
    [username, email, password].some((eachField) => eachField?.trim() === "")
  ) {
    throw new Error("Username,Email and Password all are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User with the given email already exists");

  const profilePicLocalPath = req.file?.path;
  let profilePic;
  if (profilePicLocalPath) {
    profilePic = await uploadOnCloudinary(profilePicLocalPath);
    if (!profilePic)
      throw new Error("Something went wrong while uploading the prfilePic");
  }

  const user = await User.create({
    username,
    email,
    password,
    profilePic: profilePic?.url || null,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) throw new Error("Error while creating the user");

  res.status(200).json({
    status: 200,
    data: createdUser,
    msg: "User registered successfully",
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) throw new Error("Email is required");
  if (!password) throw new Error("Password is required");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new Error("Password and Email didn't match");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      status: 200,
      data: loggedInUser,
      msg: "User logged in successfully",
    });
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { refreshToken: null } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
  };

  res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json({
    status: 200,
    data: {},
    msg: "User successfully logged out",
  });
});

const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) throw new Error("Login required");

  const decodedToken = await jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken._id);

  if (!user || refreshToken !== user.refreshToken)
    throw new Error("Invalid refresh Token");

  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshToken(user?._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json({ status: 200, data: user, msg: "User refreshed successfully" });
});

const getCurrentUser = await asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user?._id).select("-password");
  if (!currentUser) throw new Error("User not found");

  res.status(200).json({
    status: 200,
    data: currentUser,
    msg: "Current User found successfully",
  });
});

export const userController = {
  signup,
  login,
  logout,
  refresh,
  getCurrentUser,
};
