const express = require("express");
const { requireAuth } = require("../middleware/auth");
const {
  listItems,
  getItem,
  createItem,
  updateItem,
  deleteItem
} = require("../controllers/inventoryController");
const { incQty, setPrice } = require("../controllers/inventoryQuickController");

const router = express.Router();

router.get("/", requireAuth, listItems);
router.post("/", requireAuth, createItem);
router.get("/:id", requireAuth, getItem);
router.put("/:id", requireAuth, updateItem);
router.delete("/:id", requireAuth, deleteItem);

router.patch("/:id/quantity", requireAuth, incQty);
router.patch("/:id/price", requireAuth, setPrice);

module.exports = router;

