import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

export const userController = {
  signup,
};
