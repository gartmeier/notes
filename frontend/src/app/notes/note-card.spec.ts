import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Note } from './note.model';
import { NoteCard } from './note-card';
import { NoteService } from './note.service';

const MOCK_NOTE: Note = {
  id: 1,
  content: 'hello',
  owner: 'user',
  createdAt: '2025-06-15T10:00:00Z',
  updatedAt: '2025-06-15T10:00:00Z',
  version: 0,
};

@Component({ selector: 'app-test-host', imports: [NoteCard], template: `<app-note-card [note]="note" />` })
class TestHost {
  note = MOCK_NOTE;
}

describe('NoteCard', () => {
  let component: NoteCard;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let serviceMock: any;

  beforeEach(async () => {
    serviceMock = {
      updateNote: vi.fn(),
      deleteNote: vi.fn(),
      notes: signal<Note[]>([]),
      loading: signal(false),
      loadNotes: vi.fn(),
      createNote: vi.fn(),
    } as unknown as NoteService;

    await TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [{ provide: NoteService, useValue: serviceMock }],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    component = fixture.debugElement.children[0].componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('startEdit', () => {
    it('should set editing=true and populate editContent', () => {
      component.startEdit();
      expect(component.editing()).toBe(true);
      expect(component.editContent).toBe('hello');
    });
  });

  describe('save', () => {
    it('should call updateNote and reset editing', () => {
      component.startEdit();
      component.editContent = 'updated';
      component.save();
      expect(serviceMock.updateNote).toHaveBeenCalledWith(1, 'updated');
      expect(component.editing()).toBe(false);
    });

    it('should skip empty content', () => {
      component.startEdit();
      component.editContent = '   ';
      component.save();
      expect(serviceMock.updateNote).not.toHaveBeenCalled();
    });
  });

  describe('cancelEdit', () => {
    it('should reset editing to false', () => {
      component.startEdit();
      component.cancelEdit();
      expect(component.editing()).toBe(false);
    });
  });

  describe('delete', () => {
    it('should call deleteNote', () => {
      component.delete();
      expect(serviceMock.deleteNote).toHaveBeenCalledWith(1);
    });
  });

  describe('formattedDate', () => {
    it('should return formatted date string', () => {
      const formatted = component.formattedDate();
      expect(formatted).toContain('Jun');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2025');
    });
  });
});
