package com.example.liarsdice.repository;

import com.example.liarsdice.model.Game;
import com.example.liarsdice.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {

    Optional<Game> findByRoomAndStatus(Room room, Game.GameStatus status);

    List<Game> findByRoom(Room room);

    @Query("SELECT g FROM Game g WHERE g.status = :status")
    List<Game> findByStatus(@Param("status") Game.GameStatus status);

    @Query("SELECT g FROM Game g WHERE g.room.id = :roomId AND g.status IN ('WAITING', 'IN_PROGRESS')")
    Optional<Game> findActiveGameByRoomId(@Param("roomId") Long roomId);
}