const inventoryService = require("../services/inventoryService");

// Module 6: Quick Inline Update endpoints (atomic ops)

async function incQty(req, res) {
  try {
    const result = await inventoryService.incQuantity({
      dbid: req.user.dbid,
      id: req.params.id,
      delta: req.body?.delta
    });

    if (!result) return res.status(404).json({ message: "Item not found" });
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function setPrice(req, res) {
  try {
    const result = await inventoryService.setPrice({
      dbid: req.user.dbid,
      id: req.params.id,
      price: req.body?.price
    });

    if (!result) return res.status(404).json({ message: "Item not found" });
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports = { incQty, setPrice };

