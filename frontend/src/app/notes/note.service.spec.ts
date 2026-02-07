import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { toast } from 'ngx-sonner';
import { Note } from './note.model';
import { NoteService } from './note.service';

vi.mock('ngx-sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const MOCK_NOTE: Note = {
  id: 1,
  content: 'test',
  owner: 'user',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  version: 0,
};

describe('NoteService', () => {
  let service: NoteService;
  let http: HttpTestingController;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(NoteService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  describe('loadNotes', () => {
    it('should set notes and loading=false on success', () => {
      service.loadNotes();
      expect(service.loading()).toBe(true);

      http.expectOne('/api/notes').flush([MOCK_NOTE]);

      expect(service.notes()).toEqual([MOCK_NOTE]);
      expect(service.loading()).toBe(false);
    });

    it('should show error toast on failure', () => {
      service.loadNotes();
      http.expectOne('/api/notes').error(new ProgressEvent('error'));

      expect(service.loading()).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('Failed to load notes');
    });
  });

  describe('createNote', () => {
    it('should prepend note to signal on success', () => {
      service.notes.set([MOCK_NOTE]);
      const newNote = { ...MOCK_NOTE, id: 2, content: 'new' };

      service.createNote('new');
      const req = http.expectOne('/api/notes');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ content: 'new' });
      req.flush(newNote);

      expect(service.notes()[0]).toEqual(newNote);
      expect(toast.success).toHaveBeenCalledWith('Note created');
    });

    it('should show error toast on failure', () => {
      service.createNote('new');
      http.expectOne('/api/notes').error(new ProgressEvent('error'));
      expect(toast.error).toHaveBeenCalledWith('Failed to create note');
    });
  });

  describe('updateNote', () => {
    it('should replace matching note in signal', () => {
      service.notes.set([MOCK_NOTE]);
      const updated = { ...MOCK_NOTE, content: 'updated' };

      service.updateNote(1, 'updated');
      const req = http.expectOne('/api/notes/1');
      expect(req.request.method).toBe('PUT');
      req.flush(updated);

      expect(service.notes()[0].content).toBe('updated');
      expect(toast.success).toHaveBeenCalledWith('Note updated');
    });

    it('should show error toast on failure', () => {
      service.updateNote(1, 'updated');
      http.expectOne('/api/notes/1').error(new ProgressEvent('error'));
      expect(toast.error).toHaveBeenCalledWith('Failed to update note');
    });
  });

  describe('deleteNote', () => {
    it('should remove note from signal', () => {
      service.notes.set([MOCK_NOTE]);

      service.deleteNote(1);
      const req = http.expectOne('/api/notes/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);

      expect(service.notes()).toEqual([]);
      expect(toast.success).toHaveBeenCalledWith('Note deleted');
    });

    it('should show error toast on failure', () => {
      service.deleteNote(1);
      http.expectOne('/api/notes/1').error(new ProgressEvent('error'));
      expect(toast.error).toHaveBeenCalledWith('Failed to delete note');
    });
  });
});
