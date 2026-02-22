ALTER TABLE DiscoveryBooking ADD COLUMN email TEXT NOT NULL DEFAULT '';
ALTER TABLE DiscoveryBooking ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';
CREATE INDEX idx_discovery_booking_date_time ON DiscoveryBooking(date, time);
