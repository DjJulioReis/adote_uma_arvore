-- Criação do Banco de Dados:
CREATE DATABASE IF NOT EXISTS `tree_adoption` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `tree_adoption`;

-- Tabela para as espécies de árvores (catálogo)
CREATE TABLE IF NOT EXISTS `species` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name_pt` VARCHAR(255) NOT NULL,
  `name_en` VARCHAR(255) NOT NULL,
  `description_pt` TEXT,
  `description_en` TEXT,
  `image_url` VARCHAR(255)
) ENGINE=InnoDB;

-- Tabela para os usuários que adotam as árvores
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabela para registrar as adoções, agora ligada a uma espécie
CREATE TABLE IF NOT EXISTS `adoptions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `species_id` INT NOT NULL,
  `adoption_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `expires_at` TIMESTAMP NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`species_id`) REFERENCES `species`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabela para os pagamentos
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `adoption_id` INT NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `currency` VARCHAR(10) NOT NULL,
  `payment_status` ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  `transaction_id` VARCHAR(255),
  `payment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`adoption_id`) REFERENCES `adoptions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabela para os administradores do painel
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
