import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePencil, lucideTrash2 } from '@ng-icons/lucide';
import { BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { BrnDialogClose } from '@spartan-ng/brain/dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { Note } from './note.model';
import { NoteService } from './note.service';

@Component({
  selector: 'app-note-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    NgIcon,
    HlmIcon,
    HlmButton,
    HlmTextarea,
    ...HlmCardImports,
    ...HlmAlertDialogImports,
    BrnAlertDialogTrigger,
    BrnDialogClose,
  ],
  providers: [provideIcons({ lucidePencil, lucideTrash2 })],
  host: { class: 'block' },
  template: `
    @if (editing()) {
      <section hlmCard>
        <div hlmCardContent>
          <label class="sr-only" for="edit-{{ note().id }}">Edit note</label>
          <textarea
            hlmTextarea
            class="min-h-24 w-full"
            [id]="'edit-' + note().id"
            [(ngModel)]="editContent"
            (keydown.meta.Enter)="save()"
            (keydown.control.Enter)="save()"
          ></textarea>
        </div>
        <div hlmCardFooter class="gap-2">
          <button hlmBtn size="sm" (click)="save()">Save</button>
          <button hlmBtn variant="ghost" size="sm" (click)="cancelEdit()">Cancel</button>
        </div>
      </section>
    } @else {
      <section hlmCard class="group relative">
        <div hlmCardContent>
          <p class="text-sm whitespace-pre-wrap">{{ note().content }}</p>
        </div>
        <div hlmCardFooter class="justify-between">
          <time class="text-muted-foreground text-xs" [attr.datetime]="note().updatedAt">
            {{ formatDate(note().updatedAt) }}
          </time>
          <div class="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <button
              hlmBtn
              variant="ghost"
              size="icon-sm"
              (click)="startEdit()"
              aria-label="Edit note"
            >
              <ng-icon hlmIcon name="lucidePencil" size="sm" />
            </button>

            <hlm-alert-dialog>
              <button hlmAlertDialogTrigger hlmBtn variant="ghost" size="icon-sm" aria-label="Delete note">
                <ng-icon hlmIcon name="lucideTrash2" size="sm" />
              </button>
              <div hlmAlertDialogPortal>
                <div hlmAlertDialogContent>
                  <div hlmAlertDialogHeader>
                    <h2 hlmAlertDialogTitle>Delete note?</h2>
                    <p hlmAlertDialogDescription>This action cannot be undone.</p>
                  </div>
                  <div hlmAlertDialogFooter>
                    <button hlmAlertDialogCancel brnDialogClose>Cancel</button>
                    <button hlmAlertDialogAction brnDialogClose variant="destructive" (click)="delete()">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </hlm-alert-dialog>
          </div>
        </div>
      </section>
    }
  `,
})
export class NoteCard {
  private readonly service = inject(NoteService);

  readonly note = input.required<Note>();
  readonly deleted = output<number>();

  readonly editing = signal(false);
  editContent = '';

  startEdit() {
    this.editContent = this.note().content;
    this.editing.set(true);
  }

  cancelEdit() {
    this.editing.set(false);
  }

  save() {
    const content = this.editContent.trim();
    if (!content) return;
    this.service.updateNote(this.note().id, content);
    this.editing.set(false);
  }

  delete() {
    this.service.deleteNote(this.note().id);
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
