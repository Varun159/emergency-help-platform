const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/*
REGISTER USER
*/

exports.registerUser = async (req, res) => {
  console.log("Registration request received for:", req.body.email);
  try {
    const { name, email, password, phone, role, latitude, longitude, institution, address } = req.body;

    // Robust coordinate parsing with defaults for safety if geolocation fails
    let lat = parseFloat(latitude);
    let lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      console.warn("Invalid coordinates received, defaulting to 0,0");
      lat = 0;
      lng = 0;
    }

    // check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("Registration failed: User already exists", email);
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
      institution: institution || "",
      address: address || "",
      location: {
        type: "Point",
        coordinates: [lng, lat]
      }
    });

    console.log("User registered successfully:", email);
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role } // exclude password from response
    });

  } catch (error) {
    console.error("CRITICAL REGISTRATION ERROR:", error);
    res.status(500).json({ message: error.message || "Registration failed" });
  }
};


/*
LOGIN USER
*/

exports.loginUser = async (req, res) => {
  console.log("Login attempt for email:", req.body.email);
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      console.log("Login failed: User not found");
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

    res.status(500).json({ message: error.message || "Login failed" });

  }

};



/*
GET CURRENT USER PROFILE
*/

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};



/*
UPDATE USER PROFILE
*/

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, institution, address } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (institution !== undefined) user.institution = institution;
    if (address !== undefined) user.address = address;

    await user.save();

    const updatedUser = await User.findById(req.user.id).select("-password");
    res.json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update profile" });
  }
};