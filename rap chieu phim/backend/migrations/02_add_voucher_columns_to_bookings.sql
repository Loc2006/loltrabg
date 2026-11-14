-- ==============================================================================
-- Migration 02: Bổ sung cột voucher_code và discount_amount vào bảng bookings (STT 22)
-- LƯU Ý: Vui lòng BACKUP cơ sở dữ liệu MySQL trước khi thực thi migration này!
-- ==============================================================================

ALTER TABLE `bookings`
  ADD COLUMN `voucher_code` VARCHAR(50) NULL AFTER `total_amount`,
  ADD COLUMN `discount_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER `voucher_code`;
