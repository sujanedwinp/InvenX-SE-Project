const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { getDashboardStats } = require("../controllers/dashboardController");

const router = express.Router();

// GET /api/dashboard/stats — aggregated counts scoped to the authenticated user
router.get("/stats", requireAuth, getDashboardStats);

module.exports = router;
