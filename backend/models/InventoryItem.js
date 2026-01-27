const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },

    alerts: {
      minQty: { type: Number, default: 0, min: 0 },
      maxPrice: { type: Number, default: 0, min: 0 },
      enabled: { type: Boolean, default: false }
    },

    // WHERE DBID IS REFERENCED IN INVENTORY:
    // - createdBy stores the *User.dbid* (NOT email; NOT ObjectId).
    // - It is assigned from req.user.dbid in Module 5/6 after JWT auth (Module 3).
    createdBy: { type: String, required: true, index: true }
  },
  {
    timestamps: { createdAt: false, updatedAt: true }
  }
);

// Optional helper relation: populate creator by matching Inventory.createdBy -> User.dbid
inventoryItemSchema.virtual("createdByUser", {
  ref: "User",
  localField: "createdBy",
  foreignField: "dbid",
  justOne: true
});

module.exports = mongoose.model("InventoryItem", inventoryItemSchema);

