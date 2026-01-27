import React, { useEffect, useState } from "react";
import {
  createInventoryItem,
  deleteInventoryItem,
  getInventoryItem,
  updateInventoryItem
} from "../services/inventory";

function normalizePayload({ name, quantity, price, alerts }) {
  return {
    name: String(name || "").trim(),
    quantity: Number(quantity),
    price: Number(price),
    alerts: {
      enabled: Boolean(alerts.enabled),
      minQty: Number(alerts.minQty || 0),
      maxPrice: Number(alerts.maxPrice || 0)
    }
  };
}

export default function InventoryItemPage({ itemId, onBack }) {
  const isNew = !itemId;

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [minQty, setMinQty] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(itemId));

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!itemId) return;
      setError("");
      setLoading(true);
      try {
        const data = await getInventoryItem(itemId);
        if (cancelled) return;
        const item = data.item;
        setName(item.name || "");
        setQuantity(item.quantity ?? 0);
        setPrice(item.price ?? 0);
        setAlertsEnabled(Boolean(item.alerts?.enabled));
        setMinQty(item.alerts?.minQty ?? 0);
        setMaxPrice(item.alerts?.maxPrice ?? 0);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load item");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [itemId]);

  async function onSave(e) {
    e.preventDefault();
    setError("");
    try {
      const payload = normalizePayload({
        name,
        quantity,
        price,
        alerts: { enabled: alertsEnabled, minQty, maxPrice }
      });

      if (isNew) {
        await createInventoryItem(payload);
      } else {
        await updateInventoryItem(itemId, payload);
      }

      onBack();
    } catch (err) {
      setError(err.message || "Save failed");
    }
  }

  async function onDelete() {
    if (isNew) return;
    if (!confirm("Delete this item?")) return;
    await deleteInventoryItem(itemId);
    onBack();
  }

  return (
    <div className="card">
      <div className="row">
        <h2 style={{ margin: 0 }}>{isNew ? "Add Item" : "Edit Item"}</h2>
        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button className="btn" onClick={onBack}>
            Back
          </button>
          {!isNew ? (
            <button className="btn danger" onClick={onDelete}>
              Delete
            </button>
          ) : null}
        </div>
      </div>

      {loading ? <div className="muted" style={{ marginTop: 12 }}>Loading...</div> : null}
      {error ? <div className="error" style={{ marginTop: 12 }}>{error}</div> : null}

      <form onSubmit={onSave} className="stack" style={{ marginTop: 12 }}>
        <label className="stack">
          <span>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" />
        </label>

        <div className="grid2">
          <label className="stack">
            <span>Quantity</span>
            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              inputMode="numeric"
              type="number"
              min="0"
            />
          </label>

          <label className="stack">
            <span>Price</span>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              inputMode="decimal"
              type="number"
              min="0"
              step="0.01"
            />
          </label>
        </div>

        <div className="card" style={{ padding: 12 }}>
          <div className="row">
            <strong>Alerts</strong>
            <label className="row" style={{ justifyContent: "flex-end", gap: 8 }}>
              <span className="muted">Enabled</span>
              <input
                type="checkbox"
                checked={alertsEnabled}
                onChange={(e) => setAlertsEnabled(e.target.checked)}
              />
            </label>
          </div>

          <div className="grid2" style={{ marginTop: 10 }}>
            <label className="stack">
              <span>Min Qty</span>
              <input
                value={minQty}
                onChange={(e) => setMinQty(e.target.value)}
                inputMode="numeric"
                type="number"
                min="0"
                disabled={!alertsEnabled}
              />
            </label>

            <label className="stack">
              <span>Max Price</span>
              <input
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                inputMode="decimal"
                type="number"
                min="0"
                step="0.01"
                disabled={!alertsEnabled}
              />
            </label>
          </div>
          <div className="muted" style={{ marginTop: 8 }}>
            (Alert evaluation runs server-side after updates in Module 7.)
          </div>
        </div>

        <button className="btn" type="submit">
          Save
        </button>
      </form>
    </div>
  );
}

