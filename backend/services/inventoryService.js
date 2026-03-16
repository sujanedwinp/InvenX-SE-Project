const InventoryItem = require("../models/InventoryItem");
const { evaluateItemAlerts } = require("./alertEngine");
const { validateItemFields } = require("../utils/validators");

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

  // Full server-side validation — mirrors frontend rules
  const v = validateItemFields({
    name:     payload.name,
    quantity: payload.quantity,
    price:    payload.price,
    minQty:   payload.alerts?.minQty,
    maxPrice: payload.alerts?.maxPrice
  });
  if (!v.valid) throw new Error(v.message);

  const existing = await InventoryItem.findOne({
    name: { $regex: new RegExp(`^${payload.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    createdBy: dbid
  });

  if (existing) {
    existing.quantity += payload.quantity;
    existing.price = payload.price;
    if (payload.alerts) existing.alerts = payload.alerts;
    const saved = await existing.save();
    return { item: saved.toObject(), alertStatus: evaluateItemAlerts(saved) };
  }

  const item = await InventoryItem.create({
    ...payload,
    createdBy: dbid
  });

  return { item: item.toObject(), alertStatus: evaluateItemAlerts(item) };
}

async function updateFull({ dbid, id, body }) {
  const payload = toItemPayload(body || {});

  // Full server-side validation — mirrors frontend rules
  const v = validateItemFields({
    name:     payload.name,
    quantity: payload.quantity,
    price:    payload.price,
    minQty:   payload.alerts?.minQty,
    maxPrice: payload.alerts?.maxPrice
  });
  if (!v.valid) throw new Error(v.message);

  const item = await InventoryItem.findOneAndUpdate(
    { _id: id, createdBy: dbid },
    {
      $set: {
        name:     payload.name,
        quantity: payload.quantity,
        price:    payload.price,
        alerts:   payload.alerts
      }
    },
    { new: true, runValidators: true }
  );

  return item ? { item: item.toObject(), alertStatus: evaluateItemAlerts(item) } : null;
}
async function incQuantity({ dbid, id, nqty }) {
  const n = Number(nqty);
  if (!Number.isFinite(n) || n === 0) throw new Error("Quantity must be a non-zero number.");

  const item = await InventoryItem.findOneAndUpdate(
    { _id: id, createdBy: dbid },
    { $inc: { quantity: n } },
    { new: true, runValidators: true }
  );

  return item ? { item: item.toObject(), alertStatus: evaluateItemAlerts(item) } : null;
}

async function setPrice({ dbid, id, price }) {
  const n = Number(price);
  if (!Number.isFinite(n) || n < 0) throw new Error("Price must be a non-negative number.");

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

