import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { VerbService } from '../../services/verb.service';

@Component({
  selector: 'app-letter-selector',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sidebar glass-card">
      <div class="nav-title">Choose Letter</div>
      <div class="letters-grid">
        <ng-container *ngFor="let letter of allLetters">
          <a 
            *ngIf="isAvailable(letter); else disabledBtn"
            [routerLink]="[basePath, letter]"
            routerLinkActive="active"
            class="letter-btn"
          >
            {{ letter }}
          </a>
          <ng-template #disabledBtn>
            <span class="letter-btn disabled">{{ letter }}</span>
          </ng-template>
        </ng-container>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar { padding: 1.5rem; height: fit-content; position: sticky; top: 120px; }
    .nav-title { font-weight: 600; margin-bottom: 1rem; color: var(--text-muted); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.1rem; }
    .letters-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
    .letter-btn {
      aspect-ratio: 1; border: none; background: transparent; border-radius: 0.8rem; font-weight: 600; color: var(--text-muted); cursor: pointer; transition: all 0.2s ease;
      font-family: inherit; display: flex; align-items: center; justify-content: center; text-decoration: none;
      &:hover { background: rgba(99, 102, 241, 0.1); color: var(--primary); }
      &.active { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }
      &.disabled { 
        opacity: 0.2; 
        cursor: not-allowed; 
        background: transparent !important; 
        color: var(--text-muted) !important;
        box-shadow: none !important;
      }
    }
  `]
})
export class LetterSelectorComponent {
  private router = inject(Router);
  private verbService = inject(VerbService);
  
  allLetters: string[] = 'ABCDEFGHIJKLMNOPQRSTUVW'.split('');

  isAvailable(letter: string): boolean {
    return this.verbService.availableLetters().includes(letter);
  }

  get basePath(): string {
    return this.router.url.includes('/letter') ? '/letter' : '/letter';
  }
}
