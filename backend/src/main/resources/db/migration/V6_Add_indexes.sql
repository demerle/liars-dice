CREATE INDEX idx_rooms_active ON rooms(is_active);
CREATE INDEX idx_rooms_creator ON rooms(creator_id);
CREATE INDEX idx_games_room ON games(room_id);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_players_game ON players(game_id);
CREATE INDEX idx_players_user ON players(user_id);
CREATE INDEX idx_game_moves_game ON game_moves(game_id);
CREATE INDEX idx_game_moves_created_at ON game_moves(created_at);