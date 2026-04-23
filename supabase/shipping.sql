alter table if exists public.customer_orders
  add column if not exists shipping_status text,
  add column if not exists shiprocket_order_id text,
  add column if not exists shiprocket_shipment_id text,
  add column if not exists shiprocket_channel_order_id text,
  add column if not exists shiprocket_awb_code text,
  add column if not exists shiprocket_courier_name text,
  add column if not exists shiprocket_tracking_url text,
  add column if not exists shiprocket_last_event text,
  add column if not exists shiprocket_last_scan_at timestamptz,
  add column if not exists shiprocket_tracking_payload jsonb,
  add column if not exists shiprocket_synced_at timestamptz,
  add column if not exists delivered_at timestamptz;

create index if not exists customer_orders_shiprocket_awb_idx on public.customer_orders(shiprocket_awb_code);
create index if not exists customer_orders_shiprocket_order_idx on public.customer_orders(shiprocket_order_id);
create index if not exists customer_orders_shiprocket_channel_order_idx on public.customer_orders(shiprocket_channel_order_id);
