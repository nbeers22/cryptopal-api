CREATE TABLE cryptopal_users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  favorites INTEGER ARRAY,
  date_created TIMESTAMP DEFAULT now() NOT NULL,
  date_modified TIMESTAMP
);
