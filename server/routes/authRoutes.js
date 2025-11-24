const express = require("express");
const router = express.Router();
const userController = require("../controllers/authController");
const authenticate = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post(
  "/register",
  upload.single("profileImage"),
  userController.register
);

router.post("/login", userController.login);

router.get("/profile", authenticate, userController.getProfile);

router.put(
  "/profile",
  authenticate,
  upload.single("profileImage"),
  userController.updateProfile
);

router.get("/doctors", userController.getAllDoctors);

router.get("/doctor/:id", userController.getDoctorById);

router.put(
  "/doctors/:id/status",
  authenticate,
  userController.updateDoctorStatus
);

module.exports = router;
