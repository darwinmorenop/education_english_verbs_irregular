import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HistoryService, HistorySession } from '../../services/history.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
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
export class HistoryComponent {
  private historyService = inject(HistoryService);
  private router = inject(Router);

  history = this.historyService.history;
  allowClear = environment.history?.allowClear ?? true;

  repeatSession(session: HistorySession) {
    this.router.navigate([`/${session.type}`], { 
      state: { presetData: session.data, reviewMode: false } 
    });
  }

  viewResults(session: HistorySession) {
    this.router.navigate([`/${session.type}`], { 
      state: { 
        presetData: session.data, 
        userAnswers: session.userAnswers, 
        results: session.results,
        helpSentences: session.helpSentences,
        helpVerbs: session.helpVerbs,
        reviewMode: true
      } 
    });
  }

  getHelpCount(session: HistorySession): number {
    const s = (session.helpSentences || []).filter(h => h).length;
    const v = (session.helpVerbs || []).filter(h => h).length;
    return s + v;
  }

  clearAll() {
    if (!this.allowClear) return;
    if (confirm('Are you sure you want to clear your entire history?')) {
      this.historyService.clearHistory();
    }
  }

  getLocalDate(date: Date): string {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getTypeLabel(type: string): string {
    return type === 'sentences' ? 'Practice Sentences' : 'Morphological Mastery';
  }
}
