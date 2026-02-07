import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmToaster } from '@spartan-ng/helm/sonner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HlmToaster],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="border-border bg-background/95 sticky top-0 z-10 border-b backdrop-blur">
      <div class="mx-auto flex max-w-4xl items-center px-6 py-4">
        <h1 class="text-xl font-semibold tracking-tight">Notes</h1>
      </div>
    </header>
    <main class="mx-auto max-w-4xl px-6 py-8">
      <router-outlet />
    </main>
    <hlm-toaster />
  `,
})
export class App {}
