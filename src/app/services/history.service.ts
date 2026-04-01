import { Injectable, signal } from '@angular/core';
import { Verb } from '../models/verb.model';

export type ExerciseType = 'sentences' | 'forms';

export interface HistorySession {
  id: string;
  date: Date;
  type: ExerciseType;
  data: any[]; // TableExercise[] or Verb[]
  userAnswers: any[]; 
  results: boolean[]; // true if correct
  helpSentences?: boolean[]; // true if translation help was used
  helpVerbs?: boolean[]; // true if verb meaning help was used
  score: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private readonly STORAGE_KEY = 'verb_exercise_history';
  
  history = signal<HistorySession[]>(this.loadHistory());

  private loadHistory(): HistorySession[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    try {
      const parsed = JSON.parse(data);
      return parsed.map((s: any) => ({
        ...s,
        date: new Date(s.date)
      }));
    } catch {
      return [];
    }
  }

  saveSession(
    type: ExerciseType, 
    data: any[], 
    userAnswers: any[], 
    results: any[], 
    score: number, 
    total: number,
    helpSentences?: boolean[],
    helpVerbs?: boolean[]
  ) {
    const session: HistorySession = {
      id: crypto.randomUUID(),
      date: new Date(),
      type,
      data,
      userAnswers,
      results,
      score,
      total,
      helpSentences,
      helpVerbs
    };

    const current = this.loadHistory();
    const updated = [session, ...current].slice(0, 50); // Keep last 50
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    this.history.set(updated);
  }

  clearHistory() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.history.set([]);
  }
}
