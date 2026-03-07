
function evaluateItemAlerts(item) {
  const enabled = Boolean(item.alerts?.enabled);
  const minQty = Number(item.alerts?.minQty ?? 0);
  const maxPrice = Number(item.alerts?.maxPrice ?? 0);

  const triggers = [];

  if (enabled) {
    if (Number.isFinite(minQty) && minQty > 0 && item.quantity <= minQty) {
      triggers.push({
        type: "LOW_QTY",
        message: `Quantity is at/below minimum (${item.quantity} <= ${minQty})`,
        value: item.quantity,
        threshold: minQty
      });
    }

    if (Number.isFinite(maxPrice) && maxPrice > 0 && item.price >= maxPrice) {
      triggers.push({
        type: "HIGH_PRICE",
        message: `Price is at/above maximum (${item.price} >= ${maxPrice})`,
        value: item.price,
        threshold: maxPrice
      });
    }
  }

  return {
    enabled,
    isAlert: enabled && triggers.length > 0,
    triggers
  };
}

module.exports = { evaluateItemAlerts };

