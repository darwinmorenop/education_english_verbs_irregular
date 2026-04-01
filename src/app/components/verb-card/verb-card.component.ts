import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Verb } from '../../models/verb.model';

@Component({
  selector: 'app-verb-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verb-card.component.html',
  styleUrl: './verb-card.component.scss'
})
export class VerbCardComponent {
  @Input({ required: true }) verb!: Verb;
  @Input() index!: number;
  @Input() mode: 'dictionary' | 'exercise' = 'dictionary';

  userAnswers: { [key: number]: string } = {};
  checkedExercises: { [key: number]: boolean | null } = {};
  shownTranslations = signal<boolean[]>(new Array(3).fill(false));

  toggleTranslation(index: number) {
    this.shownTranslations.update(flags => {
      const newFlags = [...flags];
      newFlags[index] = !newFlags[index];
      return newFlags;
    });
  }

  get examplesPerTense() {
    const tenses = ['infinitive', 'past', 'participle'] as const;
    return tenses.map(tense => {
      const ex = this.verb.exercises?.find(e => e.tense === tense);
      if (ex) return ex;
      
      return {
        sentence: `The verb form ${tense} is used in this context: ____.`,
        answer: this.verb.forms[tense],
        tense: tense
      };
    });
  }

  getSentenceParts(sentence: string) {
    const parts = sentence.split('____');
    return {
      before: parts[0] || '',
      after: parts[1] || ''
    };
  }

  checkAnswer(exIndex: number, correctAnswer: string) {
    const userAns = (this.userAnswers[exIndex] || '').trim().toLowerCase();
    this.checkedExercises[exIndex] = userAns === correctAnswer.toLowerCase();
  }
}
