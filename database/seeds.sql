USE `tree_adoption`;

-- Inserir dados de exemplo na tabela de espécies
INSERT INTO `species` (`name_pt`, `name_en`, `description_pt`, `description_en`, `image_url`) VALUES
('Ipê-Amarelo', 'Yellow Ipê', 'O Ipê-Amarelo é uma árvore nativa do Brasil, conhecida por sua exuberante floração amarela que ocorre no final do inverno.', 'The Yellow Ipê is a native Brazilian tree, known for its exuberant yellow flowering that occurs at the end of winter.', 'images/ipe-amarelo.jpg'),
('Quaresmeira', 'Quaresmeira', 'A Quaresmeira é uma árvore da Mata Atlântica que floresce com cachos de flores roxas, principalmente durante a quaresma.', 'The Quaresmeira is an Atlantic Forest tree that blooms with clusters of purple flowers, mainly during Lent.', 'images/quaresmeira.jpg');
