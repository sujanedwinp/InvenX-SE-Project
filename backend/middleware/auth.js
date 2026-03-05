const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const [, token] = auth.split(" ");

  if (!token) {
    return res.status(401).json({ message: "Missing Authorization token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // WHERE DBID IS ATTACHED TO req.user:
    // - DBID is read from the verified JWT payload
    // - Attached to req.user for downstream controllers/services
    req.user = {
      dbid: payload.dbid,
      role: payload.role,
      // loginMethod comes from the JWT — used by /api/user/password to gate access
      loginMethod: payload.loginMethod || "dbid"
    };

    return next();
  } catch (_err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { requireAuth };

