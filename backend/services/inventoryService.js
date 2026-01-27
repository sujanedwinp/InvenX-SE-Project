const InventoryItem = require("../models/InventoryItem");
const { evaluateItemAlerts } = require("./alertEngine");

function toItemPayload(body) {
  return {
    name: String(body.name || "").trim(),
    quantity: Number(body.quantity),
    price: Number(body.price),
    alerts: {
      enabled: Boolean(body.alerts?.enabled),
      minQty: Number(body.alerts?.minQty ?? 0),
      maxPrice: Number(body.alerts?.maxPrice ?? 0)
    }
  };
}

async function listItems({ dbid }) {
  return InventoryItem.find({ createdBy: dbid }).sort({ updatedAt: -1 });
}


async function getItem({ dbid, id }) {
  return InventoryItem.findOne({ _id: id, createdBy: dbid });
}


async function createItem({ dbid, body }) {
  const payload = toItemPayload(body || {});
  if (!payload.name) throw new Error("name is required");
  if (Number.isNaN(payload.quantity) || payload.quantity < 0) throw new Error("quantity must be non-negative");
  if (Number.isNaN(payload.price) || payload.price < 0) throw new Error("price must be non-negative");

  const item = await InventoryItem.create({
    ...payload,
    createdBy: dbid
  });

  return { item: item.toObject(), alertStatus: evaluateItemAlerts(item) };
}

async function updateFull({ dbid, id, body }) {
  const payload = toItemPayload(body || {});
  if (!payload.name) throw new Error("name is required");

  const item = await InventoryItem.findOneAndUpdate(
    { _id: id, createdBy: dbid },
    {
      $set: {
        name: payload.name,
        quantity: payload.quantity,
        price: payload.price,
        alerts: payload.alerts
      }
    },
    { new: true, runValidators: true }
  );

  return item ? { item: item.toObject(), alertStatus: evaluateItemAlerts(item) } : null;
}

// Module 6: atomic operators
async function incQuantity({ dbid, id, delta }) {
  const n = Number(delta);
  if (!Number.isFinite(n) || n === 0) throw new Error("delta must be a non-zero number");

  const item = await InventoryItem.findOneAndUpdate(
    { _id: id, createdBy: dbid },
    { $inc: { quantity: n } },
    { new: true, runValidators: true }
  );

  return item ? { item: item.toObject(), alertStatus: evaluateItemAlerts(item) } : null;
}

async function setPrice({ dbid, id, price }) {
  const n = Number(price);
  if (!Number.isFinite(n) || n < 0) throw new Error("price must be a non-negative number");

  const item = await InventoryItem.findOneAndUpdate(
    { _id: id, createdBy: dbid },
    { $set: { price: n } },
    { new: true, runValidators: true }
  );

  return item ? { item: item.toObject(), alertStatus: evaluateItemAlerts(item) } : null;
}

async function deleteItem({ dbid, id }) {
  return InventoryItem.findOneAndDelete({ _id: id, createdBy: dbid });
}

module.exports = {
  listItems,
  getItem,
  createItem,
  updateFull,
  incQuantity,
  setPrice,
  deleteItem
};

