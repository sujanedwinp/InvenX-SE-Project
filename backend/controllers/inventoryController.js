const mongoose = require("mongoose");
const inventoryService = require("../services/inventoryService");

function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

async function listItems(req, res) {
  try {
    const items = await inventoryService.listItems({ dbid: req.user.dbid });
    return res.json({ items });
  } catch (err) {
    console.error("listItems error:", err);
    return res.status(500).json({ message: "Failed to fetch items" });
  }
}


async function getItem(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }
  try {
    const item = await inventoryService.getItem({ dbid: req.user.dbid, id: req.params.id });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.json({ item });
  } catch (err) {
    console.error("getItem error:", err);
    return res.status(500).json({ message: "Failed to fetch item" });
  }
}


async function createItem(req, res) {
  try {
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
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }
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
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }
  try {
    const item = await inventoryService.deleteItem({ dbid: req.user.dbid, id: req.params.id });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error("deleteItem error:", err);
    return res.status(500).json({ message: "Failed to delete item" });
  }
}


module.exports = { listItems, getItem, createItem, updateItem, deleteItem };
