import { User } from "../models/user.model.js";
import { mailer } from "../services/mailer.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteAsset, uploadOnCloudinary } from "../utils/cloudinary.js";
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

const generateFPToken = () => Math.floor(Math.random() * 1000000 + 1);

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
    "-password -refreshToken -forgetPasswordToken -forgetPasswordTokenExpires -isAdmin"
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

  const user = await User.findById(decodedToken._id).select(
    "-password -forgetPasswordToken -forgetPasswordTokenExpires"
  );

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
    .json({
      status: 200,
      data: {
        _id: user.id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      },
      msg: "User refreshed successfully",
    });
});

const getCurrentUser = await asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user?._id);
  if (!currentUser) throw new Error("User not found");

  res.status(200).json({
    status: 200,
    data: {
      _id: currentUser.id,
      username: currentUser.currentUsername,
      email: currentUser.email,
      profilePic: currentUser.profilePic,
    },
    msg: "Current currentUser found successfully",
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  if (!username && !email) throw new Error("Nothing to Update");

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        username,
        email,
      },
    },
    { new: true }
  );

  res.status(200).json({
    status: 200,
    data: {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
    },
    msg: "User updated successfully",
  });
});

const updateProfilePic = asyncHandler(async (req, res) => {
  const profilePicLocalPath = req.file?.path;
  if (!profilePicLocalPath) throw new Error("ProfilePic to update not found");

  const profilePic = await uploadOnCloudinary(profilePicLocalPath);
  if (!profilePic)
    throw new Error("Something went wrong while uploading the profilePic");

  if (req.user?.profilePic) {
    const assetId = req.user?.profilePic.split("/").pop()?.split(".")[0];
    console.log(assetId);

    if (!assetId) throw new Error("Invalid ProfilePic URL format");

    const { result } = await deleteAsset(assetId);
    console.log(result);

    if (result !== "ok") throw new Error("Previous profilePic not deleted");

    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          profilePic: profilePic.url,
        },
      },
      { new: true }
    );

    res.status(200).json({
      status: 200,
      data: {
        profilePic: updatedUser.profilePic,
      },
      msg: "User profilePic Updated Successfully",
    });
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) throw new Error("Incorrect Current Password");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 200,
    data: {},
    msg: "Password updated successfully",
  });
});

const getForgetPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error("Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const FPToken = generateFPToken().toString();
  user.forgetPasswordToken = FPToken;
  user.forgetPasswordTokenExpires = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  const isEmailSent = await mailer(
    email,
    "Account Recovery",
    `Token : ${FPToken}`
  );

  if (!isEmailSent) throw new Error("Error while sending the email");

  res
    .status(200)
    .json({ status: 200, data: {}, msg: "Please check your mail for Token" });
});

const verifyForgetPasswordToken = asyncHandler(async (req, res) => {
  const { email, token } = req.body;
  if (!email || !token) throw new Error("Email and token are required");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  if (!(user.forgetPasswordTokenExpires > Date.now()))
    throw new Error("Account Recovery Token Expired");

  if (!(user.forgetPasswordToken === token))
    throw new Error("Account Recovery Token didn't match");

  res.status(200).json({
    status: 200,
    data: {},
    msg: "Forget Password Token Verified Successfully",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  if (!token) throw new Error("Token is required");

  const { email, newPassword } = req.body;
  if (!email || !newPassword)
    throw new Error("Email and newPassword are required");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  if (!(user.forgetPasswordTokenExpires > Date.now()))
    throw new Error("Account Recovery Token Expired");

  if (!(user.forgetPasswordToken === token))
    throw new Error("Account Recovery Token didn't match");

  user.password = newPassword;
  user.forgetPasswordToken = null;
  user.forgetPasswordTokenExpires = null;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 200,
    data: {},
    msg: "Password reset successfully",
  });
});

// Admin-Only:
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json({
    status: 200,
    data: users,
    msg: "Got all the users",
  });
});

const getAUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Id is required");

  const user = await User.findById(id);
  if (!user) throw new Error("User not found with the provided Id");

  res.status(200).json({
    status: 200,
    data: user,
    msg: "User found with the given id",
  });
});

const updateProfileById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, email, isAdmin } = req.body;
  if (!username && !email && !req.file)
    throw new Error(
      "username or email or profilePic is required to update the user"
    );

  const user = await User.findById(id);
  if (!user) throw new Error("User with specified id was not found");

  const profilePicLocalPath = req.file?.path;
  let profilePic;
  if (profilePicLocalPath) {
    profilePic = await uploadOnCloudinary(profilePicLocalPath);
    if (!profilePic)
      throw new Error("Something went wrong while uploading the profilePic");
    // Delete the previous profilePic of the user from the cloud
    if (user?.profilePic) {
      const assetId = user?.profilePic.split("/").pop()?.split(".")[0];
      if (!assetId) throw new Error("Invalid profilePic URL format");
      const { result } = await deleteAsset(assetId);
      if (result !== "ok") throw new Error("Previous profilePic not deleted");
    }
  }

  user.username = username || user.username;
  user.email = email || user.email;
  user.isAdmin = isAdmin || user.isAdmin;
  user.profilePic = profilePic?.url || user.profilePic;

  const updatedUser = await user.save({
    validateBeforeSave: false,
  });

  res.status(200).json({
    status: 200,
    data: {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      isAdmin: updatedUser.isAdmin,
    },
    msg: "User profile updated successfully",
  });
});

const deleteAUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) throw new Error("User with specified id not found");
  if (user.isAdmin) throw new Error("Admin cannot be deleted");

  const response = await User.deleteOne({ _id: user._id });

  if (!response.acknowledged)
    throw new Error("Something went wrong while deleting the user");

  res
    .status(200)
    .json({ data: { response }, msg: "User deleted successfully" });
});

export const userController = {
  signup,
  login,
  logout,
  refresh,
  getCurrentUser,
  updateProfile,
  updateProfilePic,
  updatePassword,
  getForgetPasswordToken,
  verifyForgetPasswordToken,
  resetPassword,
  getAllUsers,
  getAUserById,
  updateProfileById,
  deleteAUserById,
};
