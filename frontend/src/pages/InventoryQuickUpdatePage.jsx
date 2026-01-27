import React, { useEffect, useMemo, useState } from "react";
import {
  deleteInventoryItem,
  incInventoryQty,
  listInventory,
  setInventoryPrice
} from "../services/inventory";

export default function InventoryQuickUpdatePage({ onOpenFullEdit }) {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setError("");
    setLoading(true);
    try {
      const data = await listInventory();
      setItems(data.items || []);
    } catch (err) {
      setError(err.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((i) => String(i.name || "").toLowerCase().includes(term));
  }, [items, q]);

  function mergeUpdatedItem(updated) {
    setItems((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  }

  async function onInc(id, delta) {
    try {
      const { item } = await incInventoryQty(id, delta);
      mergeUpdatedItem(item);
    } catch (err) {
      setError(err.message || "Update failed");
    }
  }

  async function onPriceBlur(id, nextPrice) {
    try {
      const { item } = await setInventoryPrice(id, nextPrice);
      mergeUpdatedItem(item);
    } catch (err) {
      setError(err.message || "Price update failed");
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this item?")) return;
    await deleteInventoryItem(id);
    setItems((prev) => prev.filter((p) => p._id !== id));
  }

  return (
    <div className="card">
      <div className="row">
        <h2 style={{ margin: 0 }}>Quick Update</h2>
        <button className="btn" onClick={refresh} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="row" style={{ marginTop: 12 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name..." />
      </div>

      {error ? <div className="error" style={{ marginTop: 12 }}>{error}</div> : null}

      <div style={{ marginTop: 12 }} className="table">
        <div className="thead">
          <div>Name</div>
          <div>Qty</div>
          <div>Price</div>
          <div>Alerts</div>
          <div />
        </div>

        {filtered.map((item) => (
          <div key={item._id} className="trow">
            <button className="link" onClick={() => onOpenFullEdit(item._id)}>
              {item.name}
            </button>

            <div className="row" style={{ justifyContent: "flex-start", gap: 8 }}>
              <button className="btn" onClick={() => onInc(item._id, -1)} disabled={item.quantity <= 0}>
                –
              </button>
              <div style={{ minWidth: 32 }}>{item.quantity}</div>
              <button className="btn" onClick={() => onInc(item._id, +1)}>
                +
              </button>
            </div>

            <div>
              <input
                defaultValue={item.price}
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                onBlur={(e) => onPriceBlur(item._id, e.target.value)}
              />
            </div>

            <div>
              {item.alerts?.enabled
                ? item.alertStatus?.isAlert
                  ? "ALERT"
                  : "On"
                : "Off"}
            </div>

            <div className="row" style={{ justifyContent: "flex-end" }}>
              <button className="btn" onClick={() => onOpenFullEdit(item._id)}>
                Full edit
              </button>
              <button className="btn danger" onClick={() => onDelete(item._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 ? (
          <div className="muted" style={{ marginTop: 12 }}>
            No items yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}

