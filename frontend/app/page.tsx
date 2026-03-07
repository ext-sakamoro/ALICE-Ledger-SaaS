export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a, #1a0a2e)",
        color: "#fff",
        fontFamily: "system-ui",
      }}
    >
      <header
        style={{
          padding: "24px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ffffff10",
        }}
      >
        <h2 style={{ margin: 0, color: "#7c3aed" }}>ALICE Ledger-SaaS</h2>
        <a href="/dashboard/console" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
          Console →
        </a>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            background: "#7c3aed20",
            color: "#7c3aed",
            borderRadius: 20,
            padding: "4px 16px",
            fontSize: 13,
            marginBottom: 24,
            border: "1px solid #7c3aed40",
          }}
        >
          Order Book Infrastructure
        </div>

        <h1 style={{ fontSize: 48, marginBottom: 16, lineHeight: 1.2 }}>
          Real-Time Order Book and Position Ledger
        </h1>
        <p style={{ fontSize: 20, color: "#aaa", marginBottom: 48, maxWidth: 600, margin: "0 auto 48px" }}>
          High-performance limit order management, cancellations, and real-time position tracking at institutional scale.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 80 }}>
          <a
            href="/dashboard/console"
            style={{
              padding: "12px 32px",
              background: "#7c3aed",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            Open Console
          </a>
          <a
            href="#features"
            style={{
              padding: "12px 32px",
              background: "#ffffff10",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 16,
              border: "1px solid #ffffff20",
            }}
          >
            Learn More
          </a>
        </div>

        <div
          id="features"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, textAlign: "left" }}
        >
          <div style={{ background: "#ffffff10", borderRadius: 12, padding: 24, border: "1px solid #ffffff10" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
            <h3 style={{ margin: "0 0 8px" }}>Limit Order Management</h3>
            <p style={{ color: "#aaa", margin: 0, fontSize: 14, lineHeight: 1.6 }}>
              Submit, modify, and track limit orders with full GTC, IOC, and FOK time-in-force support across all instruments.
            </p>
          </div>
          <div style={{ background: "#ffffff10", borderRadius: 12, padding: 24, border: "1px solid #ffffff10" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📖</div>
            <h3 style={{ margin: "0 0 8px" }}>Live Order Book</h3>
            <p style={{ color: "#aaa", margin: 0, fontSize: 14, lineHeight: 1.6 }}>
              Real-time bid/ask depth snapshots with configurable levels, price aggregation, and WebSocket streaming updates.
            </p>
          </div>
          <div style={{ background: "#ffffff10", borderRadius: 12, padding: 24, border: "1px solid #ffffff10" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>💼</div>
            <h3 style={{ margin: "0 0 8px" }}>Position Tracking</h3>
            <p style={{ color: "#aaa", margin: 0, fontSize: 14, lineHeight: 1.6 }}>
              Real-time position calculation across accounts with P&L attribution, cost basis tracking, and intraday reconciliation.
            </p>
          </div>
          <div style={{ background: "#ffffff10", borderRadius: 12, padding: 24, border: "1px solid #ffffff10" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🚫</div>
            <h3 style={{ margin: "0 0 8px" }}>Order Cancellation</h3>
            <p style={{ color: "#aaa", margin: 0, fontSize: 14, lineHeight: 1.6 }}>
              Atomic single and bulk order cancellation with reason codes, audit logging, and partial-fill handling.
            </p>
          </div>
          <div style={{ background: "#ffffff10", borderRadius: 12, padding: 24, border: "1px solid #ffffff10" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
            <h3 style={{ margin: "0 0 8px" }}>Low Latency</h3>
            <p style={{ color: "#aaa", margin: 0, fontSize: 14, lineHeight: 1.6 }}>
              Sub-microsecond order matching engine with lock-free data structures and zero-copy message passing between components.
            </p>
          </div>
          <div style={{ background: "#ffffff10", borderRadius: 12, padding: 24, border: "1px solid #ffffff10" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
            <h3 style={{ margin: "0 0 8px" }}>Ledger Analytics</h3>
            <p style={{ color: "#aaa", margin: 0, fontSize: 14, lineHeight: 1.6 }}>
              Fill rates, order book imbalance, position concentration alerts, and execution quality metrics in real time.
            </p>
          </div>
        </div>
      </main>

      <footer style={{ textAlign: "center", padding: 32, color: "#555", borderTop: "1px solid #ffffff10" }}>
        ALICE Ledger-SaaS — AGPL-3.0-or-later
      </footer>
    </div>
  );
}
