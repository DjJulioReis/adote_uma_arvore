USE `adoteumaarvore_eco`;

-- Limpa os dados antigos para garantir uma inserção limpa
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `payments`;
TRUNCATE TABLE `adoptions`;
TRUNCATE TABLE `species`;
TRUNCATE TABLE `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- Inserir a lista completa de espécies nativas com dados de compensação de carbono
INSERT INTO `species` (`name_common`, `name_scientific`, `description_pt`, `description_en`, `image_url`, `carbon_offset_kg`) VALUES
('Caroba', 'Jacaranda puberula', 'Uma árvore nativa da Mata Atlântica, apreciada por sua beleza ornamental.', 'A native tree of the Atlantic Forest, appreciated for its ornamental beauty.', 'caroba.jpg', 25.00),
('Jerivá', 'Syagrus romanzoffiana', 'Uma palmeira nativa do Brasil, cujos frutos são apreciados pela fauna local.', 'A palm tree native to Brazil, whose fruits are appreciated by local wildlife.', 'jeriva.jpg', 22.00),
('Ipê-Amarelo', 'Tabebuia alba', 'Símbolo do Brasil, conhecida por sua floração amarela espetacular.', 'Symbol of Brazil, known for its spectacular yellow bloom.', 'ipe-amarelo.jpg', 30.00),
('Caixeta', 'Tabebuia cassinoides', 'Árvore de madeira leve, encontrada em áreas úmidas da Mata Atlântica.', 'A lightwood tree found in humid areas of the Atlantic Forest.', 'caixeta.jpg', 20.00),
('Ipê-da-Serra', 'Tabebuia catarinensis', 'Variedade de ipê que ocorre em regiões de serra, com flores vistosas.', 'A variety of ipê that occurs in mountain regions, with showy flowers.', 'ipe-da-serra.jpg', 28.00),
('Ipê-da-Várzea', 'Tabebuia umbellata', 'Ipê que prefere áreas de várzea, contribuindo para a biodiversidade local.', 'An ipê that prefers floodplain areas, contributing to local biodiversity.', 'ipe-da-varzea.jpg', 26.00),
('Cupiúba', 'Tapirira guianensis', 'Árvore de grande porte, importante para a recuperação de áreas degradadas.', 'A large tree, important for the recovery of degraded areas.', 'cupiuba.jpg', 35.00),
('Pindaíba', 'Xylopia brasiliensis', 'Árvore com frutos que atraem aves, desempenhando um papel ecológico vital.', 'A tree with fruits that attract birds, playing a vital ecological role.', 'pindaiba.jpg', 23.00),
('Pata-de-Vaca', 'Bauhinia forficata', 'Conhecida por suas folhas em formato de pata de vaca, possui uso medicinal.', 'Known for its cow-hoof-shaped leaves, it has medicinal uses.', 'pata-de-vaca.jpg', 18.00),
('Aleluia', 'Senna multijuga', 'Árvore de rápido crescimento com flores amarelas, usada em paisagismo.', 'A fast-growing tree with yellow flowers, used in landscaping.', 'aleluia.jpg', 25.00),
('Guanandi', 'Calophyllum brasiliense', 'Árvore de madeira nobre, resistente à água, importante para o ecossistema.', 'A noble wood tree, water-resistant, important for the ecosystem.', 'guanandi.jpg', 32.00),
('Bacupari', 'Garcinia gardneriana', 'Produz frutos comestíveis e é uma espécie importante para a fauna.', 'Produces edible fruits and is an important species for wildlife.', 'bacupari.jpg', 20.00),
('Tapiá', 'Alchornea triplinervia', 'Pioneira em áreas de recuperação, essencial para o equilíbrio do ecossistema.', 'A pioneer species in recovery areas, essential for ecosystem balance.', 'tapia.jpg', 24.00),
('Angelin', 'Andira anthelminthica', 'Árvore de grande porte, com madeira resistente e papel ecológico relevante.', 'A large tree with resistant wood and relevant ecological role.', 'angelin-anthelminthica.jpg', 38.00),
('Angelin', 'Andira fraxinifolia', 'Outra variedade de angelin, crucial para a fixação de nitrogênio no solo.', 'Another variety of angelin, crucial for nitrogen fixation in the soil.', 'angelin-fraxinifolia.jpg', 36.00),
('Olho-de-Cabra', 'Ormosia arborea', 'Suas sementes vermelhas e pretas são usadas em artesanato.', 'Its red and black seeds are used in handicrafts.', 'olho-de-cabra.jpg', 22.00),
('Sangueiro', 'Pterocarpus violaceus', 'Conhecida por sua seiva vermelha, possui madeira de boa qualidade.', 'Known for its red sap, it has good quality wood.', 'sangueiro.jpg', 27.00),
('Guassatunga-Preta', 'Casearia obliqua', 'Espécie importante para a fauna, fornecendo alimento e abrigo.', 'An important species for wildlife, providing food and shelter.', 'guassatunga-preta.jpg', 21.00),
('Guassatunga-da-Serra', 'Casearia paranaensis', 'Variedade que ocorre na serra, adaptada a diferentes altitudes.', 'A variety that occurs in the mountains, adapted to different altitudes.', 'guassatunga-da-serra.jpg', 23.00),
('Quaresmeira', 'Tibouchina sellowiana', 'Floresce com tons de roxo vibrante, uma das árvores mais belas da Mata Atlântica.', 'Blooms with vibrant purple tones, one of the most beautiful trees in the Atlantic Forest.', 'quaresmeira.jpg', 25.00),
('Cedro-Rosa', 'Cedrela fissilis', 'Madeira nobre e aromática, ameaçada de extinção e vital para a floresta.', 'Noble and aromatic wood, endangered and vital to the forest.', 'cedro-rosa.jpg', 40.00),
('Ingá-Ferro', 'Inga sellowiana', 'Leguminosa que contribui para a fertilidade do solo.', 'A legume that contributes to soil fertility.', 'inga-ferro.jpg', 28.00),
('Ingá-Macaco', 'Inga sessilis', 'Variedade de ingá cujas vagens são alimento para a fauna.', 'A variety of ingá whose pods are food for wildlife.', 'inga-macaco.jpg', 26.00),
('Ingá', 'Inga striata', 'Outra espécie de ingá, fundamental para a recuperação de matas ciliares.', 'Another species of ingá, fundamental for the recovery of gallery forests.', 'inga.jpg', 27.00),
('Cambucá', 'Plinia edulis', 'Fruto saboroso e raro, árvore importante para a cultura e fauna locais.', 'A tasty and rare fruit, an important tree for local culture and wildlife.', 'cambuca.jpg', 20.00),
('Grumixama', 'Eugenia brasiliensis', 'Produz um fruto pequeno e escuro, semelhante a uma cereja, apreciado por aves.', 'Produces a small, dark fruit, similar to a cherry, appreciated by birds.', 'grumixama.jpg', 18.00),
('Camboim-Cereja', 'Eugenia cereja', 'Arbusto ou árvore pequena com frutos que lembram uma cereja.', 'A shrub or small tree with fruits resembling a cherry.', 'camboim-cereja.jpg', 15.00),
('Cerejeira', 'Eugenia involucrta', 'Árvore que produz a "cereja-do-rio-grande", fruto muito saboroso.', 'A tree that produces the "rio-grande-cherry", a very tasty fruit.', 'cerejeira.jpg', 19.00),
('Pitangueira', 'Eugenia uniflora', 'Famosa por seu fruto, a pitanga, é uma das árvores mais populares do Brasil.', 'Famous for its fruit, the pitanga, it is one of the most popular trees in Brazil.', 'pitangueira.jpg', 17.00),
('Araçá', 'Psidium cattleianum', 'Parente da goiaba, seu fruto é apreciado tanto por humanos quanto pela fauna.', 'A relative of the guava, its fruit is appreciated by both humans and wildlife.', 'araca.jpg', 16.00);
