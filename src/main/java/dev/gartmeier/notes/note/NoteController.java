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
    public List<Note> all() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Note one(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public Note create(@RequestBody Note note) {
        return service.create(note);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
