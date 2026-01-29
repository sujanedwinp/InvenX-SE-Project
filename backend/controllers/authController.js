const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

function signToken(user) {
  // DBID is the login identifier, so it is the primary identity in the JWT.
  return jwt.sign(
    { dbid: user.dbid, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );
}

// LOGIN API (DBID + Password)
async function login(req, res) {
  const { dbid, password } = req.body || {};

  if (!dbid || !password) {
    return res.status(400).json({ message: "dbid and password are required" });
  }

  // passwordHash is select:false, so we explicitly include it
  const user = await User.findOne({ dbid, isActive: true }).select(
    "+passwordHash name dbid role colors isActive"
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken(user);

  // Return user colors here so Module 4 can apply theme immediately after login.
  return res.json({
    token,
    user: {
      name: user.name,
      dbid: user.dbid,
      role: user.role,
      colors: user.colors
    }
  });
}

async function register(req, res) {
  const { name, dbid, password } = req.body || {};

  if (!name || !password) {
    return res.status(400).json({ message: "Name and password are required" });
  }

  // DBID is optional in schema (auto-generated) but required in this specific UI form?
  // User said "Form with DBID". If provided, we use it. If not, model generates it.
  // We'll pass it to model.

  try {
    // Check if dbid already exists if provided
    if (dbid) {
      const existingUser = await User.findOne({ dbid });
      if (existingUser) {
        return res.status(409).json({ message: "User with this DBID already exists" });
      }
    }

    const newUser = await User.create({
      name,
      dbid, // can be undefined
      passwordHash: await bcrypt.hash(password, 10),
      role: "staff" // Defaulting to staff as per "staff registration" context
    });

    // We don't log them in automatically according to requirements ("Redirect to /login on success")
    // But we should return success.
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
  // req.user.dbid is populated by middleware (requireAuth)
  const user = await User.findOne({ dbid: req.user.dbid, isActive: true }).select(
    "name dbid role colors isActive createdAt"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ user });
}

module.exports = { login, register, me };

