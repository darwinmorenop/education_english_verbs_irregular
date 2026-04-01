import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { VerbService } from '../../services/verb.service';
import { PrintService } from '../../services/print.service';
import { Verb } from '../../models/verb.model';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { environment } from '../../../environments/environment';
import { HistoryService } from '../../services/history.service';

interface VerbFormsChallenge {
  verb: Verb;
  visibleFormIndex: number; // 0: infinitive, 1: past, 2: participle, 3: meaning
  userAnswers: { [key: number]: string };
  correct: { [key: number]: boolean | null };
}

@Component({
  selector: 'app-verb-forms',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './verb-forms.component.html',
  styleUrl: './verb-forms.component.scss',
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(50, [
            animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class VerbFormsComponent implements OnInit {
  private verbService = inject(VerbService);
  private historyService = inject(HistoryService);
  private printService = inject(PrintService);
  
  readonly challengeCount = environment.exercises.forms.count;
  readonly behavior = environment.exercises.forms;
  
  challenges = signal<VerbFormsChallenge[]>([]);
  loading = signal(false);
  checked = signal(false);
  shownMeanings = signal<boolean[]>([]);
  helpVerbUsed = signal<boolean[]>([]);

  allFilled = computed(() => {
    const current = this.challenges();
    return current.length > 0 && current.every(ch => {
      const needed = [0, 1, 2, 3].filter(i => i !== ch.visibleFormIndex);
      return needed.every(i => ch.userAnswers[i]?.trim().length > 0);
    });
  });

  score = computed(() => {
    let totalCorrect = 0;
    this.challenges().forEach(ch => {
      const needed = [0, 1, 2, 3].filter(i => i !== ch.visibleFormIndex);
      if (needed.length > 0 && needed.every(i => ch.correct[i] === true)) totalCorrect++;
    });
    return totalCorrect;
  });

  ngOnInit() {
    const state = history.state;
    if (state && state.presetData) {
      this.loadPreset(state);
    } else {
      this.refreshVerbs();
    }
  }

  loadPreset(state: any) {
    const verbs = state.presetData as Verb[];
    this.loading.set(true);
    this.checked.set(!!state.reviewMode);
    this.shownMeanings.set(new Array(verbs.length).fill(false));
    this.helpVerbUsed.set(state.helpVerbs || new Array(verbs.length).fill(false));
    
    const newChallenges = verbs.map((v, i) => {
      const savedUserAnswers = state.userAnswers?.[i] || {};
      return {
        verb: v,
        visibleFormIndex: savedUserAnswers.visibleFormIndex ?? Math.floor(Math.random() * 4),
        userAnswers: savedUserAnswers.userAnswers ?? {},
        correct: state.results?.[i] ?? {}
      };
    });
    this.challenges.set(newChallenges);
    this.loading.set(false);
  }

  refreshVerbs() {
    this.loading.set(true);
    this.checked.set(false);
    this.shownMeanings.set(new Array(this.challengeCount).fill(false));
    this.helpVerbUsed.set(new Array(this.challengeCount).fill(false));

    this.verbService.getRandomVerbs(this.challengeCount).subscribe({
      next: (verbs) => {
        const newChallenges = verbs.map(v => ({
          verb: v,
          visibleFormIndex: Math.floor(Math.random() * 4),
          userAnswers: {},
          correct: {}
        }));
        this.challenges.set(newChallenges);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onAnswerChange(vIndex: number, fIndex: number, value: string) {
    this.challenges.update(list => {
      const newList = [...list];
      newList[vIndex] = {
        ...newList[vIndex],
        userAnswers: { ...newList[vIndex].userAnswers, [fIndex]: value }
      };
      return newList;
    });
  }

  printTest() {
    this.printService.preparePrint('forms', this.challenges(), 'Irregular Verbs Test: Forms');
  }

  toggleMeaning(index: number) {
    this.shownMeanings.update(flags => {
      const newFlags = [...flags];
      newFlags[index] = !newFlags[index];
      
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
    this.challenges.update(list => {
      return list.map(ch => {
        const newCorrect: { [key: number]: boolean } = {};
        const forms = [
          ch.verb.forms.infinitive, 
          ch.verb.forms.past, 
          ch.verb.forms.participle,
          ch.verb.meaning?.[0] || ''
        ];
        
        [0, 1, 2, 3].forEach(i => {
          if (i !== ch.visibleFormIndex) {
            const userAns = (ch.userAnswers[i] || '').trim().toLowerCase();
            const correctAns = forms[i].toLowerCase();
            newCorrect[i] = userAns === correctAns;
          }
        });

        return { ...ch, correct: newCorrect };
      });
    });
    this.checked.set(true);

    const currentChallenges = this.challenges();
    this.historyService.saveSession(
      'forms', 
      currentChallenges.map(c => c.verb), 
      currentChallenges.map(c => ({ userAnswers: c.userAnswers, visibleFormIndex: c.visibleFormIndex })),
      currentChallenges.map(c => c.correct),
      this.score(), 
      currentChallenges.length,
      undefined, // No sentence help in forms mode
      this.helpVerbUsed()
    );
  }

  trackByVerbId(index: number, ch: VerbFormsChallenge): string {
    return ch.verb.id;
  }
}
