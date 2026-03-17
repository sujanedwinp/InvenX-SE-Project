const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { validatePassword } = require("../utils/validators");

function isValidHex(color) {
    return typeof color === "string" && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color);
}


async function updateColors(req, res) {
    const { bg, chart, border, font } = req.body || {};

    // HEX Validation
    const HEX_RE = /^#([0-9A-F]{3}){1,2}$/i;
    const fields = { bg, chart, border, font };
    for (const [key, val] of Object.entries(fields)) {
        if (!val || !HEX_RE.test(val)) {
            return res.status(400).json({
                message: `Invalid color for '${key}': must be a valid hex value (e.g. #1a2b3c)`
            });
        }
    }

    try {
        const user = await User.findOneAndUpdate(
            { dbid: req.user.dbid, isActive: true },
            { $set: { "colors.bg": bg, "colors.chart": chart, "colors.border": border, "colors.font": font } },
            { new: true, runValidators: false }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const savedColors = {
            bg: user.colors.bg,
            chart: user.colors.chart,
            border: user.colors.border,
            font: user.colors.font
        };

        return res.json({ colors: savedColors });
    } catch (err) {
        console.error("updateColors error:", err);
        return res.status(500).json({ message: "Failed to update colors" });
    }
}

async function changePassword(req, res) {

    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "currentPassword and newPassword are required" });
    }


    const pwValidation = validatePassword(newPassword);
    if (!pwValidation.valid) {
        return res.status(400).json({ message: pwValidation.message });
    }

    try {
        const user = await User.findOne({ dbid: req.user.dbid, isActive: true }).select("+passwordHash");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const ok = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!ok) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        user.passwordHash = await bcrypt.hash(newPassword, 12);
        await user.save();

        return res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error("changePassword error:", err);
        return res.status(500).json({ message: "Failed to change password" });
    }
}

module.exports = { updateColors, changePassword };
