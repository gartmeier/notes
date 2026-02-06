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

    public List<Note> findAll(String owner) {
        return repository.findAllByOwner(owner);
    }

    public Note findById(Long id, String owner) {
        return repository.findByIdAndOwner(id, owner)
            .orElseThrow(() -> new NoteNotFoundException(id));
    }

    @Transactional
    public Note create(Note note, String owner) {
        note.setOwner(owner);
        return repository.save(note);
    }

    @Transactional
    public Note update(Long id, Note note, String owner) {
        Note existing = findById(id, owner);
        existing.setContent(note.getContent());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id, String owner) {
        if (!repository.existsByIdAndOwner(id, owner)) {
            throw new NoteNotFoundException(id);
        }
        repository.deleteById(id);
    }
}
