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
    createdBy: { type: String, required: true, index: true }
  },
  {
    timestamps: { createdAt: false, updatedAt: true }
  }
);

inventoryItemSchema.virtual("createdByUser", {
  ref: "User",
  localField: "createdBy",
  foreignField: "dbid",
  justOne: true
});

module.exports = mongoose.model("InventoryItem", inventoryItemSchema);

