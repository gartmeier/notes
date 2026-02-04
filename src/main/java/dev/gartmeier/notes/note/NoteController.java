package dev.gartmeier.notes.note;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notes")
public class NoteController {
    private final NoteService service;

    public NoteController(NoteService service) {
        this.service = service;
    }

    @GetMapping
    public List<Note> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Note findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public Note create(@RequestBody Note note) {
        return service.create(note);
    }

    @PutMapping("/{id}")
    public Note update(@PathVariable Long id, @RequestBody Note note) {
        return service.update(id, note);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
