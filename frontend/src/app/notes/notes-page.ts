import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { NoteCard } from './note-card';
import { NoteService } from './note.service';

@Component({
  selector: 'app-notes-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, HlmButton, HlmSkeleton, HlmTextarea, NoteCard],
  template: `
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-lg font-medium">Your notes</h2>
      @if (!creating()) {
        <button hlmBtn (click)="creating.set(true)">New Note</button>
      }
    </div>

    @if (creating()) {
      <div class="mb-6 space-y-3">
        <label class="sr-only" for="new-note">New note content</label>
        <textarea
          hlmTextarea
          id="new-note"
          class="min-h-24 w-full"
          placeholder="Write your note..."
          [(ngModel)]="newContent"
          (keydown.meta.Enter)="create()"
          (keydown.control.Enter)="create()"
        ></textarea>
        <div class="flex gap-2">
          <button hlmBtn size="sm" (click)="create()">Save</button>
          <button hlmBtn variant="ghost" size="sm" (click)="cancelCreate()">Cancel</button>
        </div>
      </div>
    }

    @if (loading()) {
      <div class="grid gap-4 sm:grid-cols-2">
        @for (i of skeletons; track i) {
          <div hlmSkeleton class="h-32 w-full rounded-xl"></div>
        }
      </div>
    } @else if (notes().length === 0) {
      <p class="text-muted-foreground py-12 text-center">No notes yet. Create your first one!</p>
    } @else {
      <div class="grid gap-4 sm:grid-cols-2">
        @for (note of notes(); track note.id) {
          <app-note-card [note]="note" />
        }
      </div>
    }
  `,
})
export class NotesPage implements OnInit {
  private readonly service = inject(NoteService);

  readonly notes = this.service.notes;
  readonly loading = this.service.loading;

  readonly creating = signal(false);
  newContent = '';
  readonly skeletons = [0, 1, 2, 3];

  ngOnInit() {
    this.service.loadNotes();
  }

  create() {
    const content = this.newContent.trim();
    if (!content) return;
    this.service.createNote(content);
    this.newContent = '';
    this.creating.set(false);
  }

  cancelCreate() {
    this.newContent = '';
    this.creating.set(false);
  }
}
