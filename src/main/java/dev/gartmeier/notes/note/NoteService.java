package dev.gartmeier.notes.note;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class NoteService {
    private final NoteRepository repository;

    public NoteService(NoteRepository repository) {
        this.repository = repository;
    }

    public List<Note> findAll() {
        return repository.findAll();
    }

    public Note findById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new NoteNotFoundException(id));
    }

    @Transactional
    public Note create(Note note) {
        return repository.save(note);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new NoteNotFoundException(id);
        }
        repository.deleteById(id);
    }
}
