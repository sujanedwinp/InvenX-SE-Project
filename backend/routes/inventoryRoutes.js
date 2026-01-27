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

// Same functional access for all authenticated users:
// - any authenticated user can list/create/update/delete inventory items
router.get("/", requireAuth, listItems);
router.post("/", requireAuth, createItem);
router.get("/:id", requireAuth, getItem);
router.put("/:id", requireAuth, updateItem);
router.delete("/:id", requireAuth, deleteItem);

// Module 6: Quick Inline Update routes (atomic operators)
router.patch("/:id/quantity", requireAuth, incQty); // { delta: +1|-1|... }
router.patch("/:id/price", requireAuth, setPrice); // { price: 12.34 }

module.exports = router;

