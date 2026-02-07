import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toast } from 'ngx-sonner';
import { Note, NoteRequest } from './note.model';

@Injectable({ providedIn: 'root' })
export class NoteService {
  private readonly http = inject(HttpClient);

  readonly notes = signal<Note[]>([]);
  readonly loading = signal(true);

  loadNotes() {
    this.loading.set(true);
    this.http.get<Note[]>('/api/notes').subscribe({
      next: (notes) => {
        this.notes.set(notes);
        this.loading.set(false);
      },
      error: () => {
        toast.error('Failed to load notes');
        this.loading.set(false);
      },
    });
  }

  createNote(content: string) {
    this.http.post<Note>('/api/notes', { content } as NoteRequest).subscribe({
      next: (note) => {
        this.notes.update((notes) => [note, ...notes]);
        toast.success('Note created');
      },
      error: () => toast.error('Failed to create note'),
    });
  }

  updateNote(id: number, content: string) {
    this.http.put<Note>(`/api/notes/${id}`, { content } as NoteRequest).subscribe({
      next: (updated) => {
        this.notes.update((notes) => notes.map((n) => (n.id === id ? updated : n)));
        toast.success('Note updated');
      },
      error: () => toast.error('Failed to update note'),
    });
  }

  deleteNote(id: number) {
    this.http.delete(`/api/notes/${id}`).subscribe({
      next: () => {
        this.notes.update((notes) => notes.filter((n) => n.id !== id));
        toast.success('Note deleted');
      },
      error: () => toast.error('Failed to delete note'),
    });
  }
}
