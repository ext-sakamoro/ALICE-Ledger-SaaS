# ALICE-Ledger-SaaS

Order book and position ledger SaaS with limit orders, cancellations, and real-time positions.

## Architecture

```
Frontend (Next.js 15)          API Gateway (8081)
  /dashboard/console    →      POST /api/v1/ledger/order
  /                            POST /api/v1/ledger/cancel
                               POST /api/v1/ledger/orderbook
                               POST /api/v1/ledger/positions
                               GET  /api/v1/stats
                                        |
                          +-------------+-------------+
                          |             |             |
                   Order Matching   Position Engine  Book Snapshot
                          |             |             |
                          +-------------+-------------+
                                        |
                              Order Ledger DB (append-only)
```

## Features

| Feature | Description |
|---------|-------------|
| Limit Order Management | Submit, modify, and track limit orders with full time-in-force support |
| Live Order Book | Real-time bid/ask depth with configurable levels and WebSocket streaming |
| Position Tracking | Real-time position calculation with P&L attribution and cost basis |
| Order Cancellation | Atomic single and bulk cancellation with reason codes and audit logging |
| Low Latency Matching | Sub-microsecond order matching with lock-free data structures |
| Ledger Analytics | Fill rates, order book imbalance, and execution quality metrics |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| POST | /api/v1/ledger/order | Submit a new limit order |
| POST | /api/v1/ledger/cancel | Cancel an existing order |
| POST | /api/v1/ledger/orderbook | Query order book depth snapshot |
| POST | /api/v1/ledger/positions | Query real-time positions for an account |
| GET | /api/v1/stats | Ledger statistics and metrics |

### POST /api/v1/ledger/order

```json
{
  "account_id": "ACC-001",
  "instrument": "AAPL",
  "side": "buy",
  "order_type": "limit",
  "quantity": 500,
  "price": 182.50,
  "time_in_force": "GTC"
}
```

### POST /api/v1/ledger/cancel

```json
{
  "order_id": "ORD-20260226-001",
  "account_id": "ACC-001",
  "reason": "client_request"
}
```

### POST /api/v1/ledger/orderbook

```json
{
  "instrument": "AAPL",
  "depth": 10
}
```

### POST /api/v1/ledger/positions

```json
{
  "account_id": "ACC-001",
  "as_of": "2026-02-26T00:00:00Z"
}
```

## Quick Start

```bash
docker compose up -d
# API:      http://localhost:8081
# Frontend: http://localhost:3000
```

## License

AGPL-3.0-or-later
