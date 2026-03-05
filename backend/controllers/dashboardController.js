const InventoryItem = require("../models/InventoryItem");

const TOP_N = 10; // max individual slices in chart

/**
 * GET /api/dashboard/stats
 *
 * Single $facet aggregation — one DB round-trip returns:
 *   • summary  → totalItems, totalStock, lowStock
 *   • topItems → top 10 items by quantity (for pie chart)
 *   • rest     → aggregated total of items ranked 11+
 *
 * chartData format: [{ name, value }]
 *   top 10 items by quantity + optional "Other Items" slice
 *   Items with quantity 0 are excluded from chartData.
 *
 * Low stock: counted only when alerts.enabled === true AND quantity < alerts.minQty
 */
async function getDashboardStats(req, res) {
    try {
        const dbid = req.user.dbid;

        const [facet] = await InventoryItem.aggregate([
            { $match: { createdBy: dbid } },
            {
                $facet: {
                    // ── Summary counts ───────────────────────────────────────────────
                    summary: [
                        {
                            $group: {
                                _id: null,
                                totalItems: { $sum: 1 },
                                totalStock: { $sum: "$quantity" },
                                lowStock: {
                                    $sum: {
                                        $cond: [
                                            {
                                                $and: [
                                                    { $eq: [{ $ifNull: ["$alerts.enabled", false] }, true] },
                                                    {
                                                        $lt: [
                                                            "$quantity",
                                                            { $ifNull: ["$alerts.minQty", 0] }
                                                        ]
                                                    }
                                                ]
                                            },
                                            1, 0
                                        ]
                                    }
                                }
                            }
                        }
                    ],

                    // ── Top N items for chart (sorted descending by quantity) ────────
                    topItems: [
                        { $match: { quantity: { $gt: 0 } } },  // exclude 0-quantity items
                        { $sort: { quantity: -1 } },
                        { $limit: TOP_N },
                        { $project: { _id: 0, name: 1, value: "$quantity" } }
                    ],

                    // ── Everything beyond Top N (to build "Other Items" slice) ───────
                    rest: [
                        { $match: { quantity: { $gt: 0 } } },
                        { $sort: { quantity: -1 } },
                        { $skip: TOP_N },
                        {
                            $group: {
                                _id: null,
                                otherTotal: { $sum: "$quantity" },
                                otherCount: { $sum: 1 }
                            }
                        }
                    ]
                }
            }
        ]);

        // ── Build response ────────────────────────────────────────────────────
        const summary = facet?.summary?.[0] ?? {
            totalItems: 0, totalStock: 0, lowStock: 0
        };
        const topItems = facet?.topItems ?? [];
        const restAgg = facet?.rest?.[0] ?? null;

        // Build chartData: filter out any 0-quantity slices so Recharts never
        // receives a zero-value entry (which would render a blank arc).
        const chartData = topItems.filter(i => i.value > 0);
        if (restAgg && restAgg.otherTotal > 0) {
            chartData.push({ name: "Other Items", value: restAgg.otherTotal });
        }

        return res.json({
            totalItems: summary.totalItems,
            totalStock: summary.totalStock,
            lowStock: summary.lowStock,
            chartData
        });

    } catch (err) {
        console.error("Dashboard stats error:", err);
        return res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
}

module.exports = { getDashboardStats };
