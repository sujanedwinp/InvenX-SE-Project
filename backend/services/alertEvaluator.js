// Deprecated in Module 7: kept as a compatibility shim.
// Use `services/alertEngine.js` instead.
const { evaluateItemAlerts } = require("./alertEngine");

function evaluateAlerts(item) {
  const s = evaluateItemAlerts(item);
  return {
    enabled: s.enabled,
    lowQty: s.triggers.some((t) => t.type === "LOW_QTY"),
    highPrice: s.triggers.some((t) => t.type === "HIGH_PRICE")
  };
}

module.exports = { evaluateAlerts };

