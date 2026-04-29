-- Migration V003: Admin buff/command log
-- Ghi nhận mọi lệnh admin buff item/stat cho người chơi

CREATE TABLE IF NOT EXISTS `admin_buff_log` (
  `id`            INT(11)       NOT NULL AUTO_INCREMENT,
  `admin_name`    VARCHAR(100)  NOT NULL COMMENT 'Tên nhân vật admin ra lệnh',
  `command`       VARCHAR(50)   NOT NULL COMMENT 'Lệnh admin (i, b, dm, hp, ki, up, ...)',
  `target_player` VARCHAR(100)  NOT NULL COMMENT 'Tên nhân vật được buff',
  `item_id`       INT(11)       NOT NULL DEFAULT -1 COMMENT 'ID item (-1=gold, -2=gem, -3=ruby, -99=stat)',
  `item_name`     VARCHAR(255)  NOT NULL DEFAULT '' COMMENT 'Tên item hoặc loại chỉ số',
  `quantity`      INT(11)       NOT NULL DEFAULT 1,
  `options`       TEXT          DEFAULT NULL COMMENT 'JSON array các option [id, value]',
  `created_at`    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_admin_name`    (`admin_name`),
  INDEX `idx_target_player` (`target_player`),
  INDEX `idx_created_at`    (`created_at`),
  INDEX `idx_command`       (`command`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
