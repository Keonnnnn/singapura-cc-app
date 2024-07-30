const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, Follower, Notification } = require("../models");
const yup = require("yup");
const { sign } = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const { validateToken, isAdmin } = require("../middlewares/auth");

// Send email function
const sendMailWithPromise = (mailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return reject(error);
      resolve(info);
    });
  });
};

// REGISTER CUSTOMER
router.post("/register", async (req, res) => {
  let data = req.body;

  // Validation
  let validationSchema = yup.object({
    salutations: yup
      .string()
      .trim()
      .min(2)
      .max(10)
      .required("Salutations is required")
      .matches(
        /^[a-zA-Z '-,.]+$/,
        "Salutations only allow letters, spaces and characters: ' - , ."
      ),
    firstName: yup
      .string()
      .trim()
      .min(2)
      .max(50)
      .required("First name is required")
      .matches(
        /^[a-zA-Z '-,.]+$/,
        "First name only allow letters, spaces and characters: ' - , ."
      ),
    lastName: yup
      .string()
      .trim()
      .min(2)
      .max(50)
      .required("Last name is required")
      .matches(
        /^[a-zA-Z '-,.]+$/,
        "Last name only allow letters, spaces and characters: ' - , ."
      ),
    email: yup
      .string()
      .trim()
      .lowercase()
      .email("Enter a valid email")
      .max(50)
      .required("Email is required"),
    password: yup
      .string()
      .trim()
      .min(8)
      .max(50)
      .required("Password is required")
      .matches(
        /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
      ),
    confirmPassword: yup
      .string()
      .trim()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    dateOfBirth: yup.date().required("Date of Birth is required"),
    gender: yup.string().required("Gender is required"),
    mobileNumber: yup
      .string()
      .trim()
      .matches(/^\d{8}$/, "Mobile number must be exactly 8 digits")
      .required("Mobile number is required"),
    blockNo: yup.string().trim().required("Block No. is required"),
    unitNo: yup.string().trim().required("Unit No. is required"),
    streetName: yup.string().trim().required("Street Name is required"),
    postalCode: yup
      .string()
      .trim()
      .matches(/^\d{6}$/, "Postal Code must be exactly 6 digits")
      .required("Postal Code is required"),
    idType: yup.string().required("ID Type is required"),
    idNumber: yup.string().trim().required("ID Number is required"),
    citizenshipStatus: yup.string().required("Citizenship Status is required"),
    race: yup.string().required("Race is required"),
    membershipType: yup.string().default("Bronze"),
  });

  try {
    data = await validationSchema.validate(data, { abortEarly: false });

    // Check if email already exists
    let existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists." });
      return;
    }

    // Hash password
    data.password = await bcrypt.hash(data.password, 10);

    // Create user
    let result = await User.create(data);
    res.json({ message: `Email ${result.email} was registered successfully.` });
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

// CREATE STAFF WITH ADMIN ROLE
router.post("/register-staff", validateToken, isAdmin, async (req, res) => {
  let data = req.body;

  // Validation
  let validationSchema = yup.object({
    firstName: yup
      .string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .matches(
        /^[a-zA-Z '-,.]+$/,
        "First name only allow letters, spaces and characters: ' - , ."
      ),
    lastName: yup
      .string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .matches(
        /^[a-zA-Z '-,.]+$/,
        "Last name only allow letters, spaces and characters: ' - , ."
      ),
    email: yup.string().trim().lowercase().email().max(50).required(),
    password: yup
      .string()
      .trim()
      .min(8)
      .max(50)
      .required()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
      ),
  });

  try {
    data = await validationSchema.validate(data, { abortEarly: false });

    // Check if email already exists
    let existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists." });
      return;
    }

    // Hash password
    data.password = await bcrypt.hash(data.password, 10);

    // Set role to 'Staff'
    data.role = "Staff";

    // Create user (staff)
    let result = await User.create(data);
    res.json({
      message: `Staff account for ${result.email} was created successfully.`,
    });
  } catch (err) {
    console.error("Error creating staff:", err);
    res.status(400).json({ errors: err.errors });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  let data = req.body;

  // Validation
  const validationSchema = yup.object({
    email: yup.string().trim().lowercase().email().max(50).required(),
    password: yup
      .string()
      .trim()
      .min(8)
      .max(50)
      .required()
      .matches(
        /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
      ),
    otp: yup.string().trim().length(6).nullable(), // Adjust length based on OTP requirements
  });

  try {
    data = await validationSchema.validate(data, { abortEarly: false });

    // Check if email exists
    const user = await User.findOne({ where: { email: data.email } });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect." });
    }

    // Check password
    const match = await bcrypt.compare(data.password, user.password);
    if (!match) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect." });
    }

    // Check OTP if enabled
    if (user.otpEnabled) {
      return res.json({ message: "OTP required.", needOtp: true });
    }

    // Return user info and token
    const userInfo = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      role: user.role,
      otpEnabled: user.otpEnabled,
    };

    let accessToken = sign(userInfo, process.env.APP_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRES_IN,
    });
    res.json({
      accessToken: accessToken,
      user: userInfo,
      needOtp: false,
    });
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});
const crypto = require("crypto"); // For generating secure random tokens

// Request Password Reset
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  let user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: "No user found with this email." });
  }

  // Generate a reset token and expiry date
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

  // Save the token and expiry to the user's record
  await User.update({ resetToken, resetTokenExpiry }, { where: { email } });

  // Send email with the reset link
  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: "Password Reset Request",
    html: `
    <p>To reset your password, please click the following link:</p>
    <p><a href="${resetLink}">Reset Password</a></p>
    <p>If you did not request this, please ignore this email.</p>
  `,
  };

  try {
    await sendMailWithPromise(mailOptions);
    res.json({ message: "Password reset email sent." });
  } catch (error) {
    res.status(500).json({ message: "Could not send password reset email." });
  }
});

function generateSecurePassword(length) {
  const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialCharacters = "!@#$%^&*_-+=";

  // Ensure at least one of each character type
  const getRandomChar = (charSet) => {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    return charSet[randomIndex];
  };

  let password = "";

  // Generate alphanumeric part
  const alphanumericLength = Math.floor(length * 0.8); // Adjust percentage as needed
  for (let i = 0; i < alphanumericLength; i++) {
    const charSet = [lowerCaseLetters, upperCaseLetters, numbers][
      Math.floor(Math.random() * 3)
    ];
    password += getRandomChar(charSet);
  }

  // Generate special character part
  for (let i = 0; i < length - alphanumericLength; i++) {
    password += getRandomChar(specialCharacters);
  }

  // Shuffle the password for better randomness
  password = password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  return password;
}
// Admin Reset Password
router.post("/admin/reset-password", async (req, res) => {
  const { userId } = req.body;

  // Find the user by ID
  let user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // Generate a password that meets the criteria
  const randomPassword = generateSecurePassword(10);

  // Hash the new password
  const hashedPassword = await bcrypt.hash(randomPassword, 10);

  // Update the user's password
  await User.update({ password: hashedPassword }, { where: { id: user.id } });

  // Optionally, you can send the new password to the user via email
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: user.email,
    subject: "Your Password Has Been Reset",
    html: `
      <p>Your password has been reset. Your new password is:</p>
      <p><strong>${randomPassword}</strong></p>
      <p>Please change it as soon as you log in.</p>
    `,
  };

  try {
    await sendMailWithPromise(mailOptions);
    res.json({
      message:
        "Password has been reset successfully. The new password has been sent to the user.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Password reset successful but could not send email." });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  // Validate the token
  let user = await User.findOne({
    where: {
      resetToken: token,
    },
  });

  // if (user.resetTokenExpiry < Date.now()) {
  //   return res.status(400).json({ message: "Invalid or expired token." });
  // }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password and clear the reset token
  await User.update(
    {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
    { where: { id: user.id } }
  );

  res.json({ message: "Password has been reset successfully." });
});

// AUTHENTICATE
router.get("/auth", validateToken, (req, res) => {
  let userInfo = {
    id: req.user.id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    username: req.user.username,
    role: req.user.role,
    otpEnabled: req.user.otpEnabled,
  };
  res.json({ user: userInfo });
});

router.post("/enable-otp", validateToken, async (req, res) => {
  const { userId } = req.body; // Admin provides userId to enable OTP for a specific user

  try {
    await User.update({ otpEnabled: true }, { where: { id: userId } });
    res.json({ message: "OTP enabled for user." });
  } catch (err) {
    res.status(500).json({ message: "Failed to enable OTP." });
  }
});

router.post("/generate-otp", async (req, res) => {
  const { email } = req.body;

  let user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: "No user found with this email." });
  }

  if (!user.otpEnabled) {
    return res.status(400).json({ message: "OTP not enabled for this user." });
  }

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999); // 6-digit OTP
  const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now

  // Save OTP and expiry to user
  await User.update({ otp, otpExpiry }, { where: { email } });

  // Send OTP via email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
  };

  try {
    await sendMailWithPromise(mailOptions);
    res.json({ message: "OTP sent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP." });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  let user = await User.findOne({ where: { email } });
  if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP." });
  }

  // Clear OTP after successful verification
  await User.update({ otp: null, otpExpiry: null }, { where: { email } });

  const userInfo = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    role: user.role,
    otpEnabled: user.otpEnabled,
  };

  let accessToken = sign(userInfo, process.env.APP_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN,
  });

  return res.status(200).json({
    accessToken: accessToken,
    message: "OTP verified successfully.",
  });
});

// KEON'S CODES 
// fetch user proifle by id
router.get("/profile/:id", validateToken, async (req, res) => {
  const { id } = req.params;

  try {
    let user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// FOLLOW USER
router.post("/:id/follow", validateToken, async (req, res) => {
  const { id } = req.params;

  if (req.user.id === parseInt(id)) {
      return res.status(400).json({ message: "You cannot follow yourself." });
  }

  try {
      const [follower, created] = await Follower.findOrCreate({
          where: { followerId: req.user.id, followedId: id },
          defaults: { followerId: req.user.id, followedId: id }
      });

      if (!created) {
          return res.status(400).json({ message: "You are already following this user." });
      }

      // Create a notification for the followed user
      await Notification.create({
          type: 'follow',
          message: `${req.user.username} started following you.`,
          userId: id,
          fromUserId: req.user.id
      });

      res.json({ message: "Followed successfully." });
  } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
  }
});

// UNFOLLOW USER
router.delete("/:id/unfollow", validateToken, async (req, res) => {
  const { id } = req.params;

  try {
      const result = await Follower.destroy({
          where: { followerId: req.user.id, followedId: id }
      });

      if (result === 0) {
          return res.status(400).json({ message: "You are not following this user." });
      }

      res.json({ message: "Unfollowed successfully." });
  } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET FOLLOWERS
router.get("/:id/followers", validateToken, async (req, res) => {
  const { id } = req.params;

  try {
      const followers = await Follower.findAll({
          where: { followedId: id },
          include: [{ model: User, as: 'followerUser', attributes: ['id', 'firstName', 'lastName', 'username'] }]
      });

      res.json(followers.map(f => f.followerUser));
  } catch (err) {
      console.error("Error fetching followers:", err);
      res.status(500).json({ message: "Internal Server Error" });
  }
});


// GET FOLLOWING
router.get("/:id/following", validateToken, async (req, res) => {
  const { id } = req.params;

  try {
      const following = await Follower.findAll({
          where: { followerId: id },
          include: [{ model: User, as: 'followedUser', attributes: ['id', 'firstName', 'lastName', 'username'] }]
      });

      res.json(following.map(f => f.followedUser));
  } catch (err) {
      console.error("Error fetching following:", err);
      res.status(500).json({ message: "Internal Server Error" });
  }
});

// UPDATE USER
router.put("/:id", validateToken, async (req, res) => {
  const { id } = req.params;
  let userData = req.body;

  // Validation
  let validationSchema = yup.object({
      firstName: yup.string().trim().min(2).max(50)
          .matches(/^[a-zA-Z '-,.]+$/, "First name only allow letters, spaces and characters: ' - , ."),
      lastName: yup.string().trim().min(2).max(50)
          .matches(/^[a-zA-Z '-,.]+$/, "Last name only allow letters, spaces and characters: ' - , ."),
      email: yup.string().trim().lowercase().email().max(50),
      username: yup.string().trim().min(1).max(50)
          .matches(/^[a-zA-Z0-9_.-]+$/, "Username only allows letters, numbers, underscores, periods, and hyphens."),
      // profileDescription: yup.string().trim().max(255).optional()
  });

  try {
      userData = await validationSchema.validate(userData, { abortEarly: false });

      // Check if user exists
      let user = await User.findByPk(id);
      if (!user) {
          res.status(404).json({ message: 'User not found.' });
          return;
      }

      // Exclude role from update data
      delete userData.role;

      // Update user data
      await User.update(userData, { where: { id } });

      // Return updated user data
      user = await User.findByPk(id);
      res.json(user);
  } catch (err) {
      res.status(400).json({ errors: err.errors });
  }
});

// DELETE USER
router.delete("/:id", validateToken, async (req, res) => {
  const { id } = req.params;

  try {
      // Check if user exists
      let user = await User.findByPk(id);
      if (!user) {
          res.status(404).json({ message: 'User not found.' });
          return;
      }

      // Delete user
      await User.destroy({ where: { id } });

      res.json({ message: `User with ID ${id} deleted successfully.` });
  } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
  }
});

// RETRIEVE ALL USERS
router.get("/", validateToken, isAdmin, async (req, res) => {
  try {
      const users = await User.findAll();
      res.json(users);
  } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
  }
});

// RETRIEVE SINGLE USER BY ID
router.get("/:id", validateToken, async (req, res) => {
  const { id } = req.params;

  try {
      let user = await User.findByPk(id);
      if (!user) {
          res.status(404).json({ message: 'User not found.' });
          return;
      }

      res.json(user);
  } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
