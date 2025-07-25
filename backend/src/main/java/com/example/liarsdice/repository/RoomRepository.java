package com.example.liarsdice.repository;

import com.example.liarsdice.model.Room;
import com.example.liarsdice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByIsActiveTrue();

    List<Room> findByCreator(User creator);

    @Query("SELECT r FROM Room r WHERE r.isActive = true AND r.currentPlayers < r.maxPlayers")
    List<Room> findAvailableRooms();

    @Query("SELECT r FROM Room r WHERE r.isActive = true AND r.name LIKE %:name%")
    List<Room> findByNameContainingAndIsActiveTrue(@Param("name") String name);
}