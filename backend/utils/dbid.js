const crypto = require("crypto");

const DBID_LENGTH = 8;
const DBID_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateDbid() {
  // 8-char uppercase alphanumeric
  const bytes = crypto.randomBytes(DBID_LENGTH);
  let out = "";
  for (let i = 0; i < DBID_LENGTH; i += 1) {
    out += DBID_ALPHABET[bytes[i] % DBID_ALPHABET.length];
  }
  return out;
}

module.exports = { generateDbid, DBID_LENGTH };

