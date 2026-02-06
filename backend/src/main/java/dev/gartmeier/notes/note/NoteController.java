package dev.gartmeier.notes.note;

import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
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
    public List<Note> findAll(JwtAuthenticationToken token) {
        return service.findAll(token.getName());
    }

    @GetMapping("/{id}")
    public Note findById(@PathVariable Long id, JwtAuthenticationToken token) {
        return service.findById(id, token.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Note create(@RequestBody Note note, JwtAuthenticationToken token) {
        return service.create(note, token.getName());
    }

    @PutMapping("/{id}")
    public Note update(@PathVariable Long id, @RequestBody Note note, JwtAuthenticationToken token) {
        return service.update(id, note, token.getName());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, JwtAuthenticationToken token) {
        service.delete(id, token.getName());
    }
}
