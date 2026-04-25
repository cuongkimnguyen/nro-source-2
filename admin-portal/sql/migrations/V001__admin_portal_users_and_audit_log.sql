-- Migration V001: Admin portal users table and audit log
-- Run once on first setup. Safe to re-run (uses IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS `admin_portal_users` (
  `id`         INT(11)      NOT NULL AUTO_INCREMENT,
  `username`   VARCHAR(50)  NOT NULL UNIQUE,
  `password`   VARCHAR(255) NOT NULL COMMENT 'bcrypt hash via password_hash()',
  `role`       TINYINT(1)   NOT NULL DEFAULT 1 COMMENT '1=admin, 2=superadmin',
  `is_active`  TINYINT(1)   NOT NULL DEFAULT 1,
  `last_login` TIMESTAMP    NULL DEFAULT NULL,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Default superadmin: username=admin, password=Admin@1234  (CHANGE IMMEDIATELY after first login)
INSERT IGNORE INTO `admin_portal_users` (`username`, `password`, `role`, `is_active`)
VALUES ('admin', '$2y$12$Q8VHMz1dG5GdVL5DXxoaXe9uW8PH9K3KGQ.yUJoUGwWk3Y1XBfMrW', 2, 1);

CREATE TABLE IF NOT EXISTS `admin_audit_log` (
  `id`             INT(11)      NOT NULL AUTO_INCREMENT,
  `admin_username` VARCHAR(50)  NOT NULL,
  `action`         VARCHAR(100) NOT NULL,
  `target_type`    VARCHAR(50)  DEFAULT NULL,
  `target_id`      VARCHAR(100) DEFAULT NULL,
  `before_payload` TEXT         DEFAULT NULL,
  `after_payload`  TEXT         DEFAULT NULL,
  `ip_address`     VARCHAR(45)  DEFAULT NULL,
  `created_at`     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_admin`      (`admin_username`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
