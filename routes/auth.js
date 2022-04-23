const express = require("express");
const router = express.Router();

const {
  login,
  logout,
  register,
  verifyEmail,
  resetPassword,
  forgotPassword,
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify-email/:verificationToken&:email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
