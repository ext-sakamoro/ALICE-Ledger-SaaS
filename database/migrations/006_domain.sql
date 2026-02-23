-- ALICE Ledger: Domain-specific tables
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    symbol TEXT NOT NULL,
    side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
    order_type TEXT NOT NULL DEFAULT 'limit' CHECK (order_type IN ('limit', 'market', 'stop', 'stop-limit')),
    price DOUBLE PRECISION,
    quantity DOUBLE PRECISION NOT NULL,
    filled_quantity DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    avg_fill_price DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'partial', 'filled', 'cancelled', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS trade_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buy_order_id UUID NOT NULL REFERENCES orders(id),
    sell_order_id UUID NOT NULL REFERENCES orders(id),
    symbol TEXT NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    quantity DOUBLE PRECISION NOT NULL,
    match_latency_ns BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    symbol TEXT NOT NULL,
    side TEXT NOT NULL CHECK (side IN ('long', 'short', 'flat')),
    quantity DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    avg_entry_price DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    unrealized_pnl DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    realized_pnl DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_user ON orders(user_id, created_at);
CREATE INDEX idx_orders_symbol ON orders(symbol, status);
CREATE INDEX idx_trade_matches_symbol ON trade_matches(symbol, created_at);
CREATE INDEX idx_trade_matches_buy ON trade_matches(buy_order_id);
CREATE INDEX idx_trade_matches_sell ON trade_matches(sell_order_id);
CREATE INDEX idx_positions_user ON positions(user_id);
CREATE INDEX idx_positions_symbol ON positions(user_id, symbol);
