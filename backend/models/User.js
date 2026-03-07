const mongoose = require("mongoose");
const { generateDbid } = require("../utils/dbid");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    dbid: { type: String, required: true, unique: true, index: true },

    passwordHash: { type: String, required: true, select: false },

    role: {
      type: String,
      enum: ["admin", "staff", "user"],
      default: "user",
      required: true
    },

    colors: {
      bg: { type: String, default: "#ffffff" },
      chart: { type: String, default: "#4f46e5" },
      border: { type: String, default: "#e5e7eb" },
      font: { type: String, default: "#111827" }
    },

    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);


userSchema.pre("validate", async function generateUniqueDbid(next) {
  try {
    if (!this.isNew || this.dbid) return next();

    // Loop to avoid collision
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const candidate = generateDbid();
      const exists = await this.constructor.exists({ dbid: candidate });
      if (!exists) {
        this.dbid = candidate;
        return next();
      }
    }

    return next(new Error("Failed to generate unique DBID."));
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model("User", userSchema);

