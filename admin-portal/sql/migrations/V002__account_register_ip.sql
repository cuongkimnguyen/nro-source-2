-- Migration: Add register_ip column to account table
-- This column tracks the IP used at registration time for the 2-accounts-per-IP limit.
-- Safe additive migration: column is nullable, existing rows are not affected.

ALTER TABLE `account`
  ADD COLUMN `register_ip` VARCHAR(45) NULL DEFAULT NULL
    COMMENT 'IP address used when the account was created';

CREATE INDEX `idx_account_register_ip` ON `account` (`register_ip`);
