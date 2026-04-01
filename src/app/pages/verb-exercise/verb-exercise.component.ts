import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { VerbService } from '../../services/verb.service';
import { PrintService } from '../../services/print.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { environment } from '../../../environments/environment';
import { HistoryService } from '../../services/history.service';
import { BLANK_PLACEHOLDER } from '../../models/verb.model';

interface TableExercise {
  sentence: string;
  answer: string;
  tense: string;
  verb: string;
  meaning?: string[];
  translation?: string;
}

@Component({
  selector: 'app-verb-exercise',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './verb-exercise.component.html',
  styleUrl: './verb-exercise.component.scss',
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, scale: 0.9, transform: 'translateY(10px)' }),
          stagger(80, [
            animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, scale: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class VerbExerciseComponent implements OnInit {
  private verbService = inject(VerbService);
  private historyService = inject(HistoryService);
  private router = inject(Router);
  
  private printService = inject(PrintService);
  
  readonly challengeCount = environment.exercises.sentences.count;
  readonly behavior = environment.exercises.sentences;

  exercises = signal<TableExercise[]>([]);
  loading = signal(false);
  userAnswers = signal<string[]>([]);
  checked = signal(false);
  results = signal<(boolean | null)[]>([]);
  shownTranslations = signal<boolean[]>([]);
  shownMeanings = signal<boolean[]>([]);
  helpSentenceUsed = signal<boolean[]>([]);
  helpVerbUsed = signal<boolean[]>([]);

  allFilled = computed(() => {
    const answers = this.userAnswers();
    const current = this.exercises();
    return current.length > 0 && 
           answers.length === current.length && 
           answers.every(ans => ans?.trim().length > 0);
  });

  score = computed(() => {
    return this.results().filter(r => r === true).length;
  });

  ngOnInit() {
    const state = history.state;
    if (state && state.presetData) {
      this.loadPreset(state);
    } else {
      this.refreshExercises();
    }
  }

  loadPreset(state: any) {
    const data = state.presetData as TableExercise[];
    this.loading.set(true);
    this.checked.set(!!state.reviewMode);
    
    if (state.reviewMode) {
      this.userAnswers.set(state.userAnswers || new Array(data.length).fill(''));
      this.results.set(state.results || new Array(data.length).fill(null));
    } else {
      this.userAnswers.set(new Array(data.length).fill(''));
      this.results.set(new Array(data.length).fill(null));
    }

    this.shownTranslations.set(new Array(data.length).fill(false));
    this.shownMeanings.set(new Array(data.length).fill(false));
    this.helpSentenceUsed.set(state.helpSentences || new Array(data.length).fill(false));
    this.helpVerbUsed.set(state.helpVerbs || new Array(data.length).fill(false));
    this.exercises.set(data);
    this.loading.set(false);
  }

  onAnswerChange(index: number, value: string) {
    this.userAnswers.update(answers => {
      const newAnswers = [...answers];
      newAnswers[index] = value;
      return newAnswers;
    });
  }

  refreshExercises() {
    this.loading.set(true);
    this.checked.set(false);
    this.results.set(new Array(this.challengeCount).fill(null));
    this.userAnswers.set(new Array(this.challengeCount).fill(''));
    this.shownTranslations.set(new Array(this.challengeCount).fill(false));
    this.shownMeanings.set(new Array(this.challengeCount).fill(false));
    this.helpSentenceUsed.set(new Array(this.challengeCount).fill(false));
    this.helpVerbUsed.set(new Array(this.challengeCount).fill(false));
    
    this.verbService.getRandomExercises(this.challengeCount).subscribe({
      next: (data) => {
        this.exercises.set(data as TableExercise[]);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  toggleTranslation(index: number) {
    this.shownTranslations.update(flags => {
      const newFlags = [...flags];
      newFlags[index] = !newFlags[index];
      
      // Track as help used if opened
      if (newFlags[index]) {
        this.helpSentenceUsed.update(h => {
          const newH = [...h];
          newH[index] = true;
          return newH;
        });
      }
      return newFlags;
    });
  }

  printTest() {
    this.printService.preparePrint('sentences', this.exercises(), 'Irregular Verbs Test: Sentences');
  }

  toggleMeaning(index: number) {
    this.shownMeanings.update(flags => {
      const newFlags = [...flags];
      newFlags[index] = !newFlags[index];

      // Track as help used if opened
      if (newFlags[index]) {
        this.helpVerbUsed.update(h => {
          const newH = [...h];
          newH[index] = true;
          return newH;
        });
      }
      return newFlags;
    });
  }

  checkAll() {
    const currentEx = this.exercises();
    const currentAns = this.userAnswers();
    const newResults = currentEx.map((ex, i) => {
      return (currentAns[i] || '').trim().toLowerCase() === ex.answer.toLowerCase();
    });
    this.results.set(newResults);
    this.checked.set(true);

    this.historyService.saveSession(
      'sentences', 
      currentEx, 
      this.userAnswers(),
      this.results() as boolean[],
      this.score(), 
      currentEx.length,
      this.helpSentenceUsed(),
      this.helpVerbUsed()
    );
  }

  getSentenceParts(sentence: string) {
    const parts = sentence.split(BLANK_PLACEHOLDER);
    return { before: parts[0] || '', after: parts[1] || '' };
  }

  getTenseName(tense: string): string {
    const map: { [key: string]: string } = {
      'infinitive': 'Infinitive',
      'past': 'Past Simple',
      'participle': 'Past Participle'
    };
    return map[tense] || tense;
  }
}
