package dev.gartmeier.notes.note;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findAllByOwner(String owner);
    Optional<Note> findByIdAndOwner(Long id, String owner);
    boolean existsByIdAndOwner(Long id, String owner);
}
