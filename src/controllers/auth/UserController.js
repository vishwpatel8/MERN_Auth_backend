import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModal.js";
import generateToken from "../../helpers/generateToken.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are reqired" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password Must be at lease 6 character Long." });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User Already Exist" });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = generateToken(user._id);

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: true,
    secure: true,
  });

  if (user) {
    const { _id, name, email, role, photo, bio, isVerified } = user;
    console.log(user);
    return res
      .status(201)
      .json({ _id, name, email, role, photo, bio, isVerified, token });
  } else {
    res.status(400).json({ message: "Invalid user data." });
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are Required." });
  }

  const userExists = User.findOne({ email });

  if (!userExists) {
    return res.status(400).json({ message: "Please Register before Login" });
  }

  const isMatch = await bcrypt.compare(password, userExists.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const token = generateToken(userExists._id);

  if (userExists && isMatch) {
    const { _id, name, email, role, photo, bio, isVerified } = userExists;

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: true,
      secure: true,
    });

    res
      .status(200)
      .json({ _id, name, email, role, photo, bio, isVerified, token });
  } else {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  res.send("Login User");
});
