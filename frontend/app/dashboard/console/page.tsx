"use client";
import { useState } from "react";

type Tab = "order" | "cancel" | "orderbook" | "positions" | "stats";

const DEFAULTS: Record<Tab, string> = {
  order: JSON.stringify({
    account_id: "ACC-001",
    instrument: "AAPL",
    side: "buy",
    order_type: "limit",
    quantity: 500,
    price: 182.50,
    time_in_force: "GTC"
  }, null, 2),
  cancel: JSON.stringify({
    order_id: "ORD-20260226-001",
    account_id: "ACC-001",
    reason: "client_request"
  }, null, 2),
  orderbook: JSON.stringify({
    instrument: "AAPL",
    depth: 10
  }, null, 2),
  positions: JSON.stringify({
    account_id: "ACC-001",
    as_of: "2026-02-26T00:00:00Z"
  }, null, 2),
  stats: JSON.stringify({}, null, 2),
};

const ENDPOINTS: Record<Tab, { method: string; path: string }> = {
  order:     { method: "POST", path: "/api/v1/ledger/order" },
  cancel:    { method: "POST", path: "/api/v1/ledger/cancel" },
  orderbook: { method: "POST", path: "/api/v1/ledger/orderbook" },
  positions: { method: "POST", path: "/api/v1/ledger/positions" },
  stats:     { method: "GET",  path: "/api/v1/stats" },
};

const TAB_LABELS: Record<Tab, string> = {
  order:     "Order",
  cancel:    "Cancel",
  orderbook: "Order Book",
  positions: "Positions",
  stats:     "Stats",
};

export default function ConsolePage() {
  const [activeTab, setActiveTab] = useState<Tab>("order");
  const [inputs, setInputs] = useState<Record<Tab, string>>(DEFAULTS);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:8081";

  const send = async () => {
    setLoading(true);
    setResponse("");
    const { method, path } = ENDPOINTS[activeTab];
    try {
      const opts: RequestInit = { method, headers: { "Content-Type": "application/json" } };
      if (method !== "GET") opts.body = inputs[activeTab];
      const res = await fetch(`${API}${path}`, opts);
      setResponse(JSON.stringify(await res.json(), null, 2));
    } catch (e: any) {
      setResponse(`Error: ${e.message}`);
    }
    setLoading(false);
  };

  const tabs: Tab[] = ["order", "cancel", "orderbook", "positions", "stats"];

  return (
    <div style={{ padding: 24, fontFamily: "monospace", background: "#0a0a0a", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ marginBottom: 4 }}>ALICE Ledger-SaaS — Console</h1>
      <p style={{ color: "#888", marginBottom: 24, fontSize: 14 }}>
        Order book and position ledger with limit orders, cancellations, and real-time positions.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 16px",
              background: activeTab === tab ? "#7c3aed" : "#1a1a2e",
              color: activeTab === tab ? "#fff" : "#ccc",
              border: "1px solid #333",
              borderRadius: 6,
              cursor: "pointer",
              fontFamily: "monospace",
              fontWeight: activeTab === tab ? 700 : 400,
            }}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 8, fontSize: 12, color: "#888" }}>
        <span style={{ color: ENDPOINTS[activeTab].method === "GET" ? "#0f0" : "#7c3aed" }}>
          {ENDPOINTS[activeTab].method}
        </span>{" "}
        {API}{ENDPOINTS[activeTab].path}
      </div>

      {ENDPOINTS[activeTab].method !== "GET" && (
        <textarea
          value={inputs[activeTab]}
          onChange={e => setInputs(prev => ({ ...prev, [activeTab]: e.target.value }))}
          rows={12}
          style={{
            width: "100%",
            fontFamily: "monospace",
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: 6,
            padding: 12,
            boxSizing: "border-box",
            fontSize: 13,
          }}
        />
      )}

      <button
        onClick={send}
        disabled={loading}
        style={{
          marginTop: 8,
          padding: "10px 24px",
          background: loading ? "#333" : "#7c3aed",
          color: loading ? "#666" : "#fff",
          border: "none",
          borderRadius: 6,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "monospace",
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        {loading ? "Sending..." : "Send"}
      </button>

      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: 16,
          marginTop: 16,
          minHeight: 200,
          overflow: "auto",
          borderRadius: 6,
          border: "1px solid #222",
          fontSize: 13,
        }}
      >
        {response || "// Response will appear here"}
      </pre>
    </div>
  );
}
