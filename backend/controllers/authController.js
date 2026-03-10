const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/*
REGISTER USER
*/

exports.registerUser = async (req, res) => {
  try {

    const { name, email, password, phone, role, latitude, longitude } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      location: {
        type: "Point",
        coordinates: [longitude, latitude]
      }
    });

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};


/*
LOGIN USER
*/

exports.loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};