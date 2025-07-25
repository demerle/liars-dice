package com.example.liarsdice.repository;

import com.example.liarsdice.model.Game;
import com.example.liarsdice.model.GameMove;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameMoveRepository extends JpaRepository<GameMove, Long> {

    List<GameMove> findByGameOrderByCreatedAtAsc(Game game);

    @Query("SELECT gm FROM GameMove gm WHERE gm.game = :game ORDER BY gm.createdAt DESC")
    List<GameMove> findByGameOrderByCreatedAtDesc(@Param("game") Game game);

    @Query("SELECT gm FROM GameMove gm WHERE gm.game = :game ORDER BY gm.createdAt DESC LIMIT 1")
    Optional<GameMove> findLastMoveByGame(@Param("game") Game game);

    @Query("SELECT gm FROM GameMove gm WHERE gm.game = :game AND gm.moveType = 'BID' ORDER BY gm.createdAt DESC LIMIT 1")
    Optional<GameMove> findLastBidByGame(@Param("game") Game game);
}