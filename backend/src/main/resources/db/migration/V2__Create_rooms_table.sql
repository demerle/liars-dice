CREATE TABLE rooms (
   id BIGSERIAL PRIMARY KEY,
   name VARCHAR(100) NOT NULL,
   password_hash VARCHAR(255),
   max_players INTEGER DEFAULT 6,
   current_players INTEGER DEFAULT 0,
   creator_id BIGINT REFERENCES users(id),
   is_active BOOLEAN DEFAULT true,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);