CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(20) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  category VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  amount NUMERIC(10, 2) NOT NULL,
  date DATE NOT NULL,
  vendor TEXT NOT NULL,
  description TEXT,
  transaction_id TEXT, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category_id INTEGER REFERENCES categories ON DELETE SET NULL,
  user_id INTEGER REFERENCES users ON DELETE CASCADE
);

CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  amount NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category_id INTEGER REFERENCES categories ON DELETE SET NULL,
  user_id INTEGER REFERENCES users ON DELETE CASCADE
);

CREATE TABLE accounts (
  user_id INTEGER REFERENCES users ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  item_id TEXT NOT NULL,
  account_id TEXT NOT NULL, 
  institution_id TEXT,
  institution_name TEXT,
  account_type TEXT,
  PRIMARY KEY (user_id, account_id)
);










