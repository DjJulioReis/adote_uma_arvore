-- Script de Migração para Adicionar a Coluna de Compensação de Carbono
-- Este script pode ser executado com segurança em um banco de dados existente.

-- 1. Adiciona a nova coluna `carbon_offset_kg` à tabela `species`, se ela não existir.
-- A maioria dos sistemas de banco de dados ignora este comando se a coluna já existir,
-- ou pode gerar um erro que pode ser ignorado.
ALTER TABLE `species` ADD COLUMN `carbon_offset_kg` DECIMAL(10, 2) DEFAULT 0.00;

-- 2. Atualiza os dados de compensação de carbono para cada espécie existente.
UPDATE `species` SET `carbon_offset_kg` = 25.00 WHERE `name_common` = 'Caroba';
UPDATE `species` SET `carbon_offset_kg` = 22.00 WHERE `name_common` = 'Jerivá';
UPDATE `species` SET `carbon_offset_kg` = 30.00 WHERE `name_common` = 'Ipê-Amarelo';
UPDATE `species` SET `carbon_offset_kg` = 20.00 WHERE `name_common` = 'Caixeta';
UPDATE `species` SET `carbon_offset_kg` = 28.00 WHERE `name_common` = 'Ipê-da-Serra';
UPDATE `species` SET `carbon_offset_kg` = 26.00 WHERE `name_common` = 'Ipê-da-Várzea';
UPDATE `species` SET `carbon_offset_kg` = 35.00 WHERE `name_common` = 'Cupiúba';
UPDATE `species` SET `carbon_offset_kg` = 23.00 WHERE `name_common` = 'Pindaíba';
UPDATE `species` SET `carbon_offset_kg` = 18.00 WHERE `name_common` = 'Pata-de-Vaca';
UPDATE `species` SET `carbon_offset_kg` = 25.00 WHERE `name_common` = 'Aleluia';
UPDATE `species` SET `carbon_offset_kg` = 32.00 WHERE `name_common` = 'Guanandi';
UPDATE `species` SET `carbon_offset_kg` = 20.00 WHERE `name_common` = 'Bacupari';
UPDATE `species` SET `carbon_offset_kg` = 24.00 WHERE `name_common` = 'Tapiá';
UPDATE `species` SET `carbon_offset_kg` = 38.00 WHERE `name_common` = 'Angelin' AND `name_scientific` = 'Andira anthelminthica';
UPDATE `species` SET `carbon_offset_kg` = 36.00 WHERE `name_common` = 'Angelin' AND `name_scientific` = 'Andira fraxinifolia';
UPDATE `species` SET `carbon_offset_kg` = 22.00 WHERE `name_common` = 'Olho-de-Cabra';
UPDATE `species` SET `carbon_offset_kg` = 27.00 WHERE `name_common` = 'Sangueiro';
UPDATE `species` SET `carbon_offset_kg` = 21.00 WHERE `name_common` = 'Guassatunga-Preta';
UPDATE `species` SET `carbon_offset_kg` = 23.00 WHERE `name_common` = 'Guassatunga-da-Serra';
UPDATE `species` SET `carbon_offset_kg` = 25.00 WHERE `name_common` = 'Quaresmeira';
UPDATE `species` SET `carbon_offset_kg` = 40.00 WHERE `name_common` = 'Cedro-Rosa';
UPDATE `species` SET `carbon_offset_kg` = 28.00 WHERE `name_common` = 'Ingá-Ferro';
UPDATE `species` SET `carbon_offset_kg` = 26.00 WHERE `name_common` = 'Ingá-Macaco';
UPDATE `species` SET `carbon_offset_kg` = 27.00 WHERE `name_common` = 'Ingá';
UPDATE `species` SET `carbon_offset_kg` = 20.00 WHERE `name_common` = 'Cambucá';
UPDATE `species` SET `carbon_offset_kg` = 18.00 WHERE `name_common` = 'Grumixama';
UPDATE `species` SET `carbon_offset_kg` = 15.00 WHERE `name_common` = 'Camboim-Cereja';
UPDATE `species` SET `carbon_offset_kg` = 19.00 WHERE `name_common` = 'Cerejeira';
UPDATE `species` SET `carbon_offset_kg` = 17.00 WHERE `name_common` = 'Pitangueira';
UPDATE `species` SET `carbon_offset_kg` = 16.00 WHERE `name_common` = 'Araçá';
