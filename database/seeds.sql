USE `tree_adoption`;

-- Limpa os dados antigos para evitar duplicatas
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `adoptions`;
TRUNCATE TABLE `species`;
TRUNCATE TABLE `users`;
TRUNCATE TABLE `payments`;
SET FOREIGN_KEY_CHECKS = 1;

-- Inserir as espécies de árvores (catálogo)
INSERT INTO `species` (`id`, `name_pt`, `name_en`, `description_pt`, `description_en`, `image_url`) VALUES
(1, 'Ipê-Amarelo', 'Yellow Ipê', 'O Ipê-Amarelo é uma árvore nativa do Brasil, conhecida por sua exuberante floração amarela que ocorre no final do inverno. É um símbolo do país.', 'The Yellow Ipê is a native Brazilian tree, known for its exuberant yellow flowering that occurs at the end of winter. It is a national symbol.', 'ipe-amarelo.jpg'),
(2, 'Quaresmeira', 'Quaresmeira', 'A Quaresmeira é uma árvore da Mata Atlântica que floresce com cachos de flores roxas, principalmente durante a quaresma, trazendo uma cor vibrante para a floresta.', 'The Quaresmeira is an Atlantic Forest tree that blooms with clusters of purple flowers, mainly during Lent, bringing vibrant color to the forest.', 'quaresmeira.jpg');
