package com.example.liarsdice.repository;

import com.example.liarsdice.model.Game;
import com.example.liarsdice.model.Player;
import com.example.liarsdice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {

    List<Player> findByGame(Game game);

    List<Player> findByGameOrderByPlayerOrder(Game game);

    Optional<Player> findByGameAndUser(Game game, User user);

    @Query("SELECT p FROM Player p WHERE p.game = :game AND p.isActive = true ORDER BY p.playerOrder")
    List<Player> findActivePlayersByGame(@Param("game") Game game);

    @Query("SELECT COUNT(p) FROM Player p WHERE p.game = :game AND p.isActive = true")
    long countActivePlayersByGame(@Param("game") Game game);
}