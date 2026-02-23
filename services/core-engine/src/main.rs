use axum::{extract::State, response::Json, routing::{get, post}, Router};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use std::time::Instant;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;

struct AppState { start_time: Instant, stats: Mutex<Stats> }
struct Stats { total_orders: u64, total_matches: u64, total_cancels: u64, volume_matched: f64 }

#[derive(Serialize)]
struct Health { status: String, version: String, uptime_secs: u64, total_ops: u64 }

#[derive(Deserialize)]
struct OrderRequest { instrument: String, side: String, order_type: Option<String>, price: Option<f64>, quantity: f64, client_order_id: Option<String> }
#[derive(Serialize)]
struct OrderResponse { order_id: String, client_order_id: String, instrument: String, side: String, order_type: String, price: f64, quantity: f64, filled_quantity: f64, status: String, match_latency_us: u128 }

#[derive(Deserialize)]
struct CancelRequest { order_id: String }
#[derive(Serialize)]
struct CancelResponse { order_id: String, status: String, cancelled_quantity: f64 }

#[derive(Deserialize)]
struct OrderBookRequest { instrument: String, depth: Option<u32> }
#[derive(Serialize)]
struct OrderBookResponse { instrument: String, bids: Vec<PriceLevel>, asks: Vec<PriceLevel>, spread: f64, last_update: String }
#[derive(Serialize)]
struct PriceLevel { price: f64, quantity: f64, orders: u32 }

#[derive(Deserialize)]
struct PositionRequest { account: Option<String> }
#[derive(Serialize)]
struct PositionResponse { positions: Vec<Position>, total_pnl: f64 }
#[derive(Serialize)]
struct Position { instrument: String, side: String, quantity: f64, avg_price: f64, current_price: f64, unrealized_pnl: f64 }

#[derive(Serialize)]
struct StatsResponse { total_orders: u64, total_matches: u64, total_cancels: u64, volume_matched: f64, avg_match_latency_us: u64 }

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt().with_env_filter(tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| "ledger_engine=info".into())).init();
    let state = Arc::new(AppState { start_time: Instant::now(), stats: Mutex::new(Stats { total_orders: 0, total_matches: 0, total_cancels: 0, volume_matched: 0.0 }) });
    let cors = CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any);
    let app = Router::new()
        .route("/health", get(health))
        .route("/api/v1/ledger/order", post(place_order))
        .route("/api/v1/ledger/cancel", post(cancel_order))
        .route("/api/v1/ledger/orderbook", post(orderbook))
        .route("/api/v1/ledger/positions", post(positions))
        .route("/api/v1/ledger/stats", get(stats))
        .layer(cors).layer(TraceLayer::new_for_http()).with_state(state);
    let addr = std::env::var("LEDGER_ADDR").unwrap_or_else(|_| "0.0.0.0:8081".into());
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    tracing::info!("Ledger Engine on {addr}");
    axum::serve(listener, app).await.unwrap();
}

async fn health(State(s): State<Arc<AppState>>) -> Json<Health> {
    let st = s.stats.lock().unwrap();
    Json(Health { status: "ok".into(), version: env!("CARGO_PKG_VERSION").into(), uptime_secs: s.start_time.elapsed().as_secs(), total_ops: st.total_orders + st.total_matches })
}

async fn place_order(State(s): State<Arc<AppState>>, Json(req): Json<OrderRequest>) -> Json<OrderResponse> {
    let t = Instant::now();
    let order_type = req.order_type.unwrap_or_else(|| "limit".into());
    let price = req.price.unwrap_or(100.0);
    let client_id = req.client_order_id.unwrap_or_else(|| uuid::Uuid::new_v4().to_string());
    let filled = req.quantity * 0.8; // simulate partial fill
    { let mut st = s.stats.lock().unwrap(); st.total_orders += 1; if filled > 0.0 { st.total_matches += 1; st.volume_matched += filled * price; } }
    Json(OrderResponse { order_id: uuid::Uuid::new_v4().to_string(), client_order_id: client_id, instrument: req.instrument, side: req.side, order_type, price, quantity: req.quantity, filled_quantity: filled, status: if filled >= req.quantity { "filled".into() } else { "partial".into() }, match_latency_us: t.elapsed().as_micros() })
}

async fn cancel_order(State(s): State<Arc<AppState>>, Json(req): Json<CancelRequest>) -> Json<CancelResponse> {
    s.stats.lock().unwrap().total_cancels += 1;
    Json(CancelResponse { order_id: req.order_id, status: "cancelled".into(), cancelled_quantity: 50.0 })
}

async fn orderbook(State(_s): State<Arc<AppState>>, Json(req): Json<OrderBookRequest>) -> Json<OrderBookResponse> {
    let depth = req.depth.unwrap_or(5) as usize;
    let h = fnv1a(req.instrument.as_bytes());
    let mid = 100.0 + (h % 1000) as f64 / 10.0;
    let bids: Vec<PriceLevel> = (0..depth).map(|i| PriceLevel { price: mid - (i as f64 + 1.0) * 0.1, quantity: (h.wrapping_add(i as u64) % 1000 + 100) as f64, orders: ((h.wrapping_add(i as u64)) % 10 + 1) as u32 }).collect();
    let asks: Vec<PriceLevel> = (0..depth).map(|i| PriceLevel { price: mid + (i as f64 + 1.0) * 0.1, quantity: (h.wrapping_add(i as u64 + 100) % 1000 + 100) as f64, orders: ((h.wrapping_add(i as u64 + 100)) % 10 + 1) as u32 }).collect();
    let spread = asks.first().map(|a| a.price).unwrap_or(mid + 0.1) - bids.first().map(|b| b.price).unwrap_or(mid - 0.1);
    Json(OrderBookResponse { instrument: req.instrument, bids, asks, spread, last_update: "2026-02-23T00:00:00Z".into() })
}

async fn positions(State(_s): State<Arc<AppState>>, Json(_req): Json<PositionRequest>) -> Json<PositionResponse> {
    let positions = vec![
        Position { instrument: "BTC-USD".into(), side: "long".into(), quantity: 1.5, avg_price: 95000.0, current_price: 96500.0, unrealized_pnl: 2250.0 },
        Position { instrument: "ETH-USD".into(), side: "short".into(), quantity: 10.0, avg_price: 3500.0, current_price: 3450.0, unrealized_pnl: 500.0 },
    ];
    let pnl: f64 = positions.iter().map(|p| p.unrealized_pnl).sum();
    Json(PositionResponse { positions, total_pnl: pnl })
}

async fn stats(State(s): State<Arc<AppState>>) -> Json<StatsResponse> {
    let st = s.stats.lock().unwrap();
    Json(StatsResponse { total_orders: st.total_orders, total_matches: st.total_matches, total_cancels: st.total_cancels, volume_matched: st.volume_matched, avg_match_latency_us: 15 })
}

fn fnv1a(data: &[u8]) -> u64 { let mut h: u64 = 0xcbf2_9ce4_8422_2325; for &b in data { h ^= b as u64; h = h.wrapping_mul(0x0100_0000_01b3); } h }
