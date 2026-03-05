const express = require("express");
const { updateColors, changePassword } = require("../controllers/userController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// PATCH /api/user/colors – update UI theme colors for the authenticated user
router.patch("/colors", requireAuth, updateColors);

// PATCH /api/user/password – change password (only allowed for username-based login)
router.patch("/password", requireAuth, changePassword);

module.exports = router;
