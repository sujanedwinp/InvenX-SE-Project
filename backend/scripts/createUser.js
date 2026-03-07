require("dotenv").config();

const bcrypt = require("bcryptjs");
const { connectDB } = require("../config/db");
const User = require("../models/User");

function usage() {
  console.log(
    [
      "Usage:",
      "  node scripts/createUser.js --name \"Jane\" --password \"Secret123\" [--role admin|staff|user]",
      "",
      "Notes:",
      "- DBID is auto-generated, if not provided.",
      "- Internal script only."
    ].join("\n")
  );
}

function getArg(name) {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

async function main() {
  const name = getArg("--name");
  const password = getArg("--password");
  const role = getArg("--role") || "user";

  if (!name || !password) {
    usage();
    process.exit(1);
  }

  await connectDB();

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    passwordHash,
    role,
    colors: {
      bg: "#0b1220",
      chart: "#3b82f6",
      border: "#334155",
      font: "#e5e7eb"
    },
    isActive: true
  });

  console.log("User created:");
  console.log({ name: user.name, dbid: user.dbid, role: user.role });

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

