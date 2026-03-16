const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { validateRegistration } = require("../utils/validators");

// Dummy hash used for constant-time comparison when user is not found
// Prevents timing-based user enumeration attacks
const DUMMY_HASH = "$2b$12$invalidhashpadding0000000000000000000000000000000000000";
const INVALID_CREDENTIALS = "Invalid credentials";

function signToken(user) {
  return jwt.sign(
    { dbid: user.dbid, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );
}

async function login(req, res) {
  const { dbid, password } = req.body || {};

  if (!dbid || !password) {
    return res.status(400).json({ message: "dbid and password are required" });
  }

  try {
    const user = await User.findOne({ dbid, isActive: true }).select(
      "+passwordHash name dbid role colors isActive"
    );

    const hashToCompare = user ? user.passwordHash : DUMMY_HASH;
    const ok = await bcrypt.compare(password, hashToCompare);

    if (!user || !ok) {
      return res.status(401).json({ message: INVALID_CREDENTIALS });
    }

    const token = signToken(user);

    return res.json({
      token,
      user: {
        name: user.name,
        dbid: user.dbid,
        role: user.role,
        colors: user.colors
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
}

async function register(req, res) {
  const { name, dbid, password } = req.body || {};


  const validation = validateRegistration({ name, dbid, password });
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  try {
    if (dbid) {
      const existingUser = await User.findOne({ dbid });
      if (existingUser) {
        return res.status(409).json({ message: "User with this DBID already exists!" });
      }
    }

    const newUser = await User.create({
      name,
      dbid,
      passwordHash: await bcrypt.hash(password, 12),
      role: "admin"
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        name: newUser.name,
        dbid: newUser.dbid,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Registration failed" });
  }
}


async function me(req, res) {
  const user = await User.findOne({ dbid: req.user.dbid, isActive: true }).select(
    "name dbid role colors isActive createdAt"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({
    user: {
      name: user.name,
      dbid: user.dbid,
      role: user.role,
      createdAt: user.createdAt,
      colors: {
        bg: user.colors.bg,
        chart: user.colors.chart,
        border: user.colors.border,
        font: user.colors.font
      }
    }
  });
}

module.exports = { login, register, me };

