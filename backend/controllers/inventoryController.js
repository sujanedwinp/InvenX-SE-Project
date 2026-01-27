const inventoryService = require("../services/inventoryService");

async function listItems(req, res) {
  const items = await inventoryService.listItems({ dbid: req.user.dbid });
  return res.json({ items });
}


async function getItem(req, res) {
  const item = await inventoryService.getItem({ dbid: req.user.dbid, id: req.params.id });
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }
  return res.json({ item });
}


async function createItem(req, res) {
  try {
    // IMPORTANT (Module 5):
    // Inventory creation MUST store createdBy = dbid.
    // WHERE DBID COMES FROM: JWT -> requireAuth middleware -> req.user.dbid
    const { item, alertStatus } = await inventoryService.createItem({
      dbid: req.user.dbid,
      body: req.body
    });

    return res.status(201).json({ item, alertStatus });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function updateItem(req, res) {
  try {
    const result = await inventoryService.updateFull({
      dbid: req.user.dbid,
      id: req.params.id,
      body: req.body
    });

    if (!result) return res.status(404).json({ message: "Item not found" });
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}


async function deleteItem(req, res) {
  const item = await inventoryService.deleteItem({ dbid: req.user.dbid, id: req.params.id });

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  return res.json({ ok: true });
}


module.exports = { listItems, getItem, createItem, updateItem, deleteItem };

