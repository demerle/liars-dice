CREATE TABLE game_moves (
    id BIGSERIAL PRIMARY KEY,
    game_id BIGINT REFERENCES games(id),
    player_id BIGINT REFERENCES users(id),
    move_type VARCHAR(20) NOT NULL,
    bid_quantity INTEGER,
    bid_face_value INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);