import React, { useEffect, useMemo, useState } from "react";
import { deleteInventoryItem, listInventory } from "../services/inventory";

export default function InventoryListPage({ onCreateNew, onOpenItem }) {
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

  async function onDelete(id) {
    if (!confirm("Delete this item?")) return;
    await deleteInventoryItem(id);
    await refresh();
  }

  return (
    <div className="card">
      <div className="row">
        <h2 style={{ margin: 0 }}>Inventory</h2>
        <button className="btn" onClick={onCreateNew}>
          Add item
        </button>
      </div>

      <div className="row" style={{ marginTop: 12 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name..." />
        <button className="btn" onClick={refresh} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
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
            <button className="link" onClick={() => onOpenItem(item._id)}>
              {item.name}
            </button>
            <div>{item.quantity}</div>
            <div>${Number(item.price).toFixed(2)}</div>
            <div>
              {item.alerts?.enabled
                ? item.alertStatus?.isAlert
                  ? "ALERT"
                  : "On"
                : "Off"}
            </div>
            <div className="row" style={{ justifyContent: "flex-end" }}>
              <button className="btn" onClick={() => onOpenItem(item._id)}>
                Edit
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

