const express = require("express");
const { updateColors, changePassword } = require("../controllers/userController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.patch("/colors", requireAuth, updateColors);

router.patch("/password", requireAuth, changePassword);

module.exports = router;
