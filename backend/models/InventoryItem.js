const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true, maxlength: 16 },
    quantity: { type: Number, required: true, min: 1, max: 999999999 },
    price:    { type: Number, required: true, min: 1, max: 999999999 },

    alerts: {
      minQty:   { type: Number, default: 0, min: 0, max: 999999999 },
      maxPrice: { type: Number, default: 0, min: 0, max: 999999999 },
      enabled:  { type: Boolean, default: false }
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

