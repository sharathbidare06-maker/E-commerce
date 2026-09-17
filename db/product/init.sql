CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url VARCHAR(1000),
  category VARCHAR(80) NOT NULL DEFAULT 'Essentials'
);

ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url VARCHAR(1000);
ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(80) NOT NULL DEFAULT 'Essentials';

INSERT INTO products (name, price, stock)
SELECT 'Laptop', 79999, 12
WHERE NOT EXISTS (SELECT 1 FROM products);

UPDATE products
SET image_url = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85'
WHERE name = 'Laptop' AND image_url IS NULL;

UPDATE products SET category = CASE
  WHEN name IN ('Laptop', 'Mechanical keyboard', 'Wireless mouse', 'USB-C hub', 'Portable SSD', 'Webcam', 'Cable organizer') THEN 'Work tech'
  WHEN name IN ('Desk setup', 'Monitor light bar', 'Leather desk mat', 'Ceramic mug', 'Desk lamp', 'Notebook set', 'Laptop stand', 'Ergonomic chair') THEN 'Workspace'
  WHEN name IN ('Headphones', 'Noise cancelling earbuds', 'Bluetooth speaker', 'Vinyl record player') THEN 'Audio'
  WHEN name IN ('Charging station', 'Power bank', 'Phone tripod') THEN 'Mobile'
  WHEN name IN ('Canvas backpack', 'Everyday tote', 'Travel organizer') THEN 'Carry'
  WHEN name IN ('Insulated bottle', 'Travel tumbler', 'Minimal wallet', 'Sunglasses', 'Daily planner') THEN 'Everyday'
  WHEN name IN ('Scented candle', 'Wool throw', 'Table clock', 'Plant pot', 'Reading light', 'Smart display') THEN 'Home'
  ELSE COALESCE(category, 'Essentials')
END;

INSERT INTO products (name, price, stock, image_url)
SELECT seed.name, seed.price, seed.stock, seed.image_url
FROM (VALUES
  ('Desk setup', 14999, 8, 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=900&q=85'),
  ('Headphones', 12999, 24, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85'),
  ('Mechanical keyboard', 8499, 18, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85'),
  ('Wireless mouse', 3299, 31, 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=85'),
  ('Monitor light bar', 4999, 15, 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=900&q=85'),
  ('Leather desk mat', 2499, 22, 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85'),
  ('Ceramic mug', 899, 45, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85'),
  ('Desk lamp', 3799, 17, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85'),
  ('Notebook set', 1299, 60, 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=85'),
  ('USB-C hub', 2899, 26, 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=85'),
  ('Portable SSD', 6999, 14, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=900&q=85'),
  ('Webcam', 5499, 19, 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=900&q=85'),
  ('Laptop stand', 4299, 21, 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&w=900&q=85'),
  ('Noise cancelling earbuds', 8999, 16, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=85'),
  ('Bluetooth speaker', 7499, 13, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85'),
  ('Vinyl record player', 18999, 7, 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=900&q=85'),
  ('Charging station', 3599, 28, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=85'),
  ('Power bank', 2499, 35, 'https://images.unsplash.com/photo-1609592424935-6e3f7b1f3b49?auto=format&fit=crop&w=900&q=85'),
  ('Phone tripod', 2199, 20, 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=900&q=85'),
  ('Canvas backpack', 5999, 11, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85'),
  ('Everyday tote', 2999, 25, 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85'),
  ('Travel organizer', 1899, 32, 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&w=900&q=85'),
  ('Insulated bottle', 1699, 40, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85'),
  ('Travel tumbler', 1399, 38, 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=900&q=85'),
  ('Scented candle', 1199, 27, 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85'),
  ('Wool throw', 4499, 9, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=85'),
  ('Table clock', 2799, 12, 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=900&q=85'),
  ('Plant pot', 999, 33, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85'),
  ('Reading light', 3199, 18, 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=85'),
  ('Minimal wallet', 2199, 29, 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85'),
  ('Sunglasses', 3999, 14, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85'),
  ('Daily planner', 1599, 42, 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=900&q=85'),
  ('Cable organizer', 799, 55, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=85'),
  ('Smart display', 11999, 6, 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=900&q=85'),
  ('Ergonomic chair', 24999, 5, 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=900&q=85')
) AS seed(name, price, stock, image_url)
WHERE NOT EXISTS (SELECT 1 FROM products existing WHERE existing.name = seed.name);

UPDATE products
SET category = CASE
  WHEN name IN ('Laptop', 'Mechanical keyboard', 'Wireless mouse', 'USB-C hub', 'Portable SSD', 'Webcam', 'Cable organizer') THEN 'Work tech'
  WHEN name IN ('Desk setup', 'Monitor light bar', 'Leather desk mat', 'Ceramic mug', 'Desk lamp', 'Notebook set', 'Laptop stand', 'Ergonomic chair') THEN 'Workspace'
  WHEN name IN ('Headphones', 'Noise cancelling earbuds', 'Bluetooth speaker', 'Vinyl record player') THEN 'Audio'
  WHEN name IN ('Charging station', 'Power bank', 'Phone tripod') THEN 'Mobile'
  WHEN name IN ('Canvas backpack', 'Everyday tote', 'Travel organizer') THEN 'Carry'
  WHEN name IN ('Insulated bottle', 'Travel tumbler', 'Minimal wallet', 'Sunglasses', 'Daily planner') THEN 'Everyday'
  WHEN name IN ('Scented candle', 'Wool throw', 'Table clock', 'Plant pot', 'Reading light', 'Smart display') THEN 'Home'
  ELSE COALESCE(category, 'Essentials')
END;
