CREATE TABLE players (
     id BIGSERIAL PRIMARY KEY,
     game_id BIGINT REFERENCES games(id),
     user_id BIGINT REFERENCES users(id),
     dice_count INTEGER DEFAULT 5,
     is_active BOOLEAN DEFAULT true,
     player_order INTEGER,
     UNIQUE(game_id, user_id)
);