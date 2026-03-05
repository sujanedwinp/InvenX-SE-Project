const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

function signToken(user, loginMethod = "dbid") {
  // DBID is the login identifier, so it is the primary identity in the JWT.
  // loginMethod is included so /api/user/password can gate access.
  return jwt.sign(
    { dbid: user.dbid, role: user.role, loginMethod },
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

  const token = signToken(user, "dbid");

  // Return user colors so ThemeContext applies the theme immediately after login.
  // loginMethod is returned so the Profile page can conditionally show password change.
  return res.json({
    token,
    user: {
      name: user.name,
      dbid: user.dbid,
      role: user.role,
      colors: user.colors,
      loginMethod: "dbid"
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
  // req.user.dbid is populated by requireAuth middleware (from JWT)
  const user = await User.findOne({ dbid: req.user.dbid, isActive: true }).select(
    "name dbid role colors isActive createdAt"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Return a plain object — never send a Mongoose document directly.
  // Expanding colors as a plain object prevents subdocument serialization issues.
  return res.json({
    user: {
      name: user.name,
      dbid: user.dbid,
      role: user.role,
      createdAt: user.createdAt,
      loginMethod: req.user.loginMethod || "dbid",
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

