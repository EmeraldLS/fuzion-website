CREATE TABLE products (
    id INT PRIMARY KEY AUTOINCREMENT,
    product_id TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    is_new BOOLEAN NOT NULL DEFAULT false,
    name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    rating NUMERIC(3, 1),
    discount_percent INTEGER DEFAULT 0,
    description TEXT,
    size TEXT motor TEXT,
    blade TEXT,
    pump TEXT,
    coating TEXT,
);