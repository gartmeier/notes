import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Note } from './note.model';
import { NoteService } from './note.service';
import { NotesPage } from './notes-page';

describe('NotesPage', () => {
  let component: NotesPage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let serviceMock: any;

  beforeEach(async () => {
    serviceMock = {
      notes: signal<Note[]>([]),
      loading: signal(false),
      loadNotes: vi.fn(),
      createNote: vi.fn(),
      updateNote: vi.fn(),
      deleteNote: vi.fn(),
    } as unknown as NoteService;

    await TestBed.configureTestingModule({
      imports: [NotesPage],
      providers: [{ provide: NoteService, useValue: serviceMock }],
    }).compileComponents();

    const fixture = TestBed.createComponent(NotesPage);
    component = fixture.componentInstance;
  });

  it('should call loadNotes on init', () => {
    component.ngOnInit();
    expect(serviceMock.loadNotes).toHaveBeenCalled();
  });

  describe('create', () => {
    it('should call createNote and reset state', () => {
      component.newContent = 'new note';
      component.creating.set(true);

      component.create();

      expect(serviceMock.createNote).toHaveBeenCalledWith('new note');
      expect(component.newContent).toBe('');
      expect(component.creating()).toBe(false);
    });

    it('should skip empty content', () => {
      component.newContent = '   ';
      component.create();
      expect(serviceMock.createNote).not.toHaveBeenCalled();
    });

    it('should skip whitespace-only content', () => {
      component.newContent = '\n\t  ';
      component.create();
      expect(serviceMock.createNote).not.toHaveBeenCalled();
    });
  });

  describe('cancelCreate', () => {
    it('should reset newContent and creating', () => {
      component.newContent = 'draft';
      component.creating.set(true);

      component.cancelCreate();

      expect(component.newContent).toBe('');
      expect(component.creating()).toBe(false);
    });
  });
});
