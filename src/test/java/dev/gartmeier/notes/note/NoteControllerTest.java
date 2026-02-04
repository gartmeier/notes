package dev.gartmeier.notes.note;

import dev.gartmeier.notes.config.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(NoteController.class)
@Import(SecurityConfig.class)
class NoteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private NoteService noteService;

    @Test
    void findAll_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/notes"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void findAll_returnsNotes() throws Exception {
        Note note = new Note();
        note.setId(1L);
        note.setContent("test");
        when(noteService.findAll()).thenReturn(List.of(note));

        mockMvc.perform(get("/notes").with(jwt()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].content").value("test"));
    }

    @Test
    void findAll_empty_returnsEmptyList() throws Exception {
        when(noteService.findAll()).thenReturn(List.of());

        mockMvc.perform(get("/notes").with(jwt()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void findById_returnsNote() throws Exception {
        Note note = new Note();
        note.setId(1L);
        note.setContent("test");
        when(noteService.findById(1L)).thenReturn(note);

        mockMvc.perform(get("/notes/1").with(jwt()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.content").value("test"));
    }

    @Test
    void findById_notFound_returns404() throws Exception {
        when(noteService.findById(99L)).thenThrow(new NoteNotFoundException(99L));

        mockMvc.perform(get("/notes/99").with(jwt()))
            .andExpect(status().isNotFound());
    }

    @Test
    void create_returns201() throws Exception {
        Note note = new Note();
        note.setId(1L);
        note.setContent("new note");
        when(noteService.create(any(Note.class))).thenReturn(note);

        mockMvc.perform(post("/notes")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"content\":\"new note\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.content").value("new note"));
    }

    @Test
    void update_returnsUpdatedNote() throws Exception {
        Note note = new Note();
        note.setId(1L);
        note.setContent("updated");
        when(noteService.update(eq(1L), any(Note.class))).thenReturn(note);

        mockMvc.perform(put("/notes/1")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"content\":\"updated\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").value("updated"));
    }

    @Test
    void update_notFound_returns404() throws Exception {
        when(noteService.update(eq(99L), any(Note.class)))
            .thenThrow(new NoteNotFoundException(99L));

        mockMvc.perform(put("/notes/99")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"content\":\"updated\"}"))
            .andExpect(status().isNotFound());
    }

    @Test
    void delete_returns204() throws Exception {
        mockMvc.perform(delete("/notes/1").with(jwt()))
            .andExpect(status().isNoContent());

        verify(noteService).delete(1L);
    }

    @Test
    void delete_notFound_returns404() throws Exception {
        doThrow(new NoteNotFoundException(99L)).when(noteService).delete(99L);

        mockMvc.perform(delete("/notes/99").with(jwt()))
            .andExpect(status().isNotFound());
    }
}
