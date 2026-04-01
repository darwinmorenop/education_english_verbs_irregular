import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { VerbService } from '../../services/verb.service';
import { Verb, Exercise, BLANK_PLACEHOLDER } from '../../models/verb.model';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { PrintService } from '../../services/print.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger('50ms', animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))
        ], { optional: true })
      ])
    ])
  ]
})
export class AdminComponent implements OnInit {
  private verbService = inject(VerbService);
  private router = inject(Router);
  private printService = inject(PrintService);
  readonly blankPlaceholder = BLANK_PLACEHOLDER;

  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVW'.split('');
  selectedLetter = signal('A');
  filterMode = signal<'letter' | 'enabled' | 'hidden' | 'disabled'>('letter');
  verbs = signal<Verb[]>([]);
  loading = signal(false);
  
  // Modal State
  isModalOpen = signal(false);
  editingVerb = signal<Verb | null>(null);

  ngOnInit() {
    this.loadVerbs(this.selectedLetter());
  }

  selectLetter(letter: string) {
    this.filterMode.set('letter');
    this.selectedLetter.set(letter);
    this.loadVerbs(letter);
  }

  loadVerbs(letter: string) {
    this.loading.set(true);
    this.verbService.getVerbsByLetter(letter, true).subscribe({
      next: (data) => {
        // Normalize
        const normalized = data.map(v => ({ 
          ...v, 
          enabled: v.enabled ?? true,
          hidden: v.hidden ?? false
        }));
        this.verbs.set(normalized);
        this.loading.set(false);
      },
      error: () => {
        this.verbs.set([]);
        this.loading.set(false);
      }
    });
  }

  loadFilteredVerbs(mode: 'enabled' | 'hidden' | 'disabled') {
    this.loading.set(true);
    this.filterMode.set(mode);
    this.selectedLetter.set(''); // Clear letter selection visual

    this.verbService.getAllVerbs(true).subscribe({
      next: (data) => {
        const normalized = data.map(v => ({ 
          ...v, 
          enabled: v.enabled ?? true,
          hidden: v.hidden ?? false
        }));

        if (mode === 'enabled') {
          this.verbs.set(normalized.filter(v => v.enabled !== false && v.hidden !== true));
        } else if (mode === 'disabled') {
          this.verbs.set(normalized.filter(v => v.enabled === false && v.hidden !== true));
        } else {
          this.verbs.set(normalized.filter(v => v.hidden === true));
        }
        this.loading.set(false);
      },
      error: () => {
        this.verbs.set([]);
        this.loading.set(false);
      }
    });
  }

  toggleEnable(verb: Verb) {
    const newStatus = !verb.enabled;
    this.verbs.update(list => list.map(v => 
      v.id === verb.id ? { ...v, enabled: newStatus } : v
    ));
    this.verbService.updateVerbStatus(verb.id, { enabled: newStatus });
  }

  toggleHidden(verb: Verb) {
    const newStatus = !verb.hidden;
    this.verbs.update(list => list.map(v => 
      v.id === verb.id ? { ...v, hidden: newStatus } : v
    ));
    this.verbService.updateVerbStatus(verb.id, { hidden: newStatus });
  }

  clearEnabledCache() {
    if (confirm('Verify: all enabled/disabled manual changes will be lost and restored to the origin file.')) {
      this.verbService.resetEnabledCache();
    }
  }

  clearHiddenCache() {
    if (confirm('Verify: all visibility manual changes will be lost and restored to the origin file.')) {
      this.verbService.resetHiddenCache();
    }
  }

  deleteVerb(verb: Verb) {
    if (confirm(`Are you sure you want to delete "${verb.verb}"?`)) {
      this.verbs.update(list => list.filter(v => v.id !== verb.id));
    }
  }

  openAddModal() {
    this.editingVerb.set({
      id: `${this.selectedLetter().toLowerCase()}_${Date.now()}`,
      verb: '',
      forms: { infinitive: '', past: '', participle: '' },
      meaning: [],
      exercises: [],
      enabled: true,
      hidden: false
    });
    this.isModalOpen.set(true);
  }

  openEditModal(verb: Verb) {
    // Deep copy to avoid direct signal edit
    this.editingVerb.set(JSON.parse(JSON.stringify(verb)));
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingVerb.set(null);
  }

  addExercise() {
    const v = this.editingVerb();
    if (!v) return;
    v.exercises.push({ sentence: '', answer: '', tense: 'infinitive', translation: '' });
    this.editingVerb.set({ ...v });
  }

  removeExercise(index: number) {
    const v = this.editingVerb();
    if (!v) return;
    v.exercises.splice(index, 1);
    this.editingVerb.set({ ...v });
  }

  updateMeaning(index: number, value: string) {
    const v = this.editingVerb();
    if (!v) return;
    v.meaning = v.meaning || [];
    v.meaning[index] = value;
    this.editingVerb.set({...v});
  }

  addMeaning() {
    const v = this.editingVerb();
    if (!v) return;
    v.meaning = v.meaning || [];
    v.meaning.push('');
    this.editingVerb.set({...v});
  }

  saveVerb() {
    const edited = this.editingVerb();
    if (!edited) return;

    this.verbs.update(list => {
      const idx = list.findIndex(v => v.id === edited.id);
      if (idx > -1) {
        list[idx] = edited;
        return [...list];
      } else {
        return [...list, edited];
      }
    });
    this.closeModal();
  }

  generateTest() {
    const gen = environment.admin.generation;
    if (!gen) return;

    this.loading.set(true);
    forkJoin({
      sentences: this.verbService.getRandomExercises(gen.sentencesCount),
      forms: this.verbService.getRandomVerbs(gen.formsCount)
    }).subscribe({
      next: ({ sentences, forms }) => {
        const formChallenges = forms.map(v => ({
          verb: v,
          visibleFormIndex: Math.floor(Math.random() * 4)
        }));
        
        this.printService.preparePrint('composite', { 
          sentences, 
          forms: formChallenges 
        }, 'Comprehensive Irregular Verbs Test');
        
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  // To help the user save manually or for me to see
  exportJson() {
    const blob = JSON.stringify(this.verbs(), null, 2);
    navigator.clipboard.writeText(blob).then(() => {
      alert(`JSON for ${this.selectedLetter()}.json copied to clipboard!\n\nYou can now ask Antigravity to apply these changes to the file.`);
    }).catch(err => {
      console.error('Copy failed:', err);
      console.log(blob);
      alert('Failed to copy to clipboard. Check console for JSON output.');
    });
  }
}
