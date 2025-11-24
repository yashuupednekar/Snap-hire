const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const Doctor = require("../models/Doctor");

// Register a new user (can be Patient, Doctor, or Admin)
exports.register = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    contact,
    specialization,
    experience,
    feesPerSession,
    availability,
  } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      contact,
    });

    await user.save();

    // Create additional profiles based on role
    if (role === "Doctor") {
      const doctor = new Doctor({
        userId: user._id,
        specialization,
        experience,
        feesPerSession,
        availability,
        status: "Pending",
      });
      await doctor.save();
    }

    if (role === "Admin") {
      const admin = new Admin({ userId: user._id });
      await admin.save();
    }

    // Generate JWT token
    const payload = { user: { id: user.id, role: user.role } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;

        // Send only token & role (No extra details)
        res.json({ token, role: user.role });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Login user (for all roles)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;

        // Send both token and user details
        res.json({
          token,
          user: {
            id: user.id,
            role: user.role,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get user profile (for all roles)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let profile = { ...user.toObject() };

    // If the user is a doctor, fetch doctor details
    if (user.role === "Doctor") {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      if (doctor) {
        profile.doctorDetails = doctor;
      }
    }

    // If the user is an admin, fetch admin details
    if (user.role === "Admin") {
      const admin = await Admin.findOne({ userId: req.user.id });
      if (admin) {
        profile.adminDetails = admin;
      }
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update user profile (for all roles)
exports.updateProfile = async (req, res) => {
  const {
    name,
    contact,
    specialization,
    experience,
    feesPerSession,
    availability,
  } = req.body;

  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Save only filename if a new file is uploaded
    if (req.file) {
      user.profileImage = req.file.filename;
    }

    // Update user details
    user.name = name || user.name;
    user.contact = contact || user.contact;

    await user.save();

    // If user is a doctor, update doctor details
    if (user.role === "Doctor") {
      let doctor = await Doctor.findOne({ userId: req.user.id });
      if (doctor) {
        doctor.specialization = specialization || doctor.specialization;
        doctor.experience = experience || doctor.experience;
        doctor.feesPerSession = feesPerSession || doctor.feesPerSession;
        doctor.availability = availability || doctor.availability;

        await doctor.save();
      }
    }

    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get all doctors (for admin)
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "Approved" }).populate(
      "userId",
      "name email contact profileImage"
    );

    if (!doctors.length) {
      return res.status(404).json({ message: "No approved doctors found" });
    }

    res.json(doctors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update doctor status (for admin)
exports.updateDoctorStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.status = status;
    await doctor.save();

    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "userId",
      "name email contact profileImage"
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};