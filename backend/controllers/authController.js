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

module.exports = { login, me };

