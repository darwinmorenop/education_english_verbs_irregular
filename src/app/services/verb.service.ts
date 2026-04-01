import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError, shareReplay } from 'rxjs';
import { Verb } from '../models/verb.model';

@Injectable({
  providedIn: 'root'
})
export class VerbService {
  private http = inject(HttpClient);
  private dataUrl = 'verbs.json';
  
  // Cache the one source of truth
  private allVerbs$ = this.http.get<Verb[]>(this.dataUrl).pipe(
    catchError(() => of([])),
    shareReplay(1)
  );
  
  availableLetters = signal<string[]>([]);

  constructor() {
    this.refreshAvailableLetters();
  }

  refreshAvailableLetters() {
    this.allVerbs$.pipe(
      map(verbs => {
        const letters = new Set<string>();
        verbs.forEach(v => {
          if (v.hidden !== true && v.verb) {
            letters.add(v.verb.charAt(0).toUpperCase());
          }
        });
        return Array.from(letters).sort();
      })
    ).subscribe(available => {
      this.availableLetters.set(available);
    });
  }

  getVerbsByLetter(letter: string, includeHidden = false): Observable<Verb[]> {
    const target = letter.toUpperCase();
    return this.allVerbs$.pipe(
      map(verbs => verbs.filter(v => 
        v.verb.charAt(0).toUpperCase() === target && 
        (includeHidden || v.hidden !== true)
      ))
    );
  }

  getAllVerbs(includeHidden = false): Observable<Verb[]> {
    return this.allVerbs$.pipe(
      map(verbs => {
        const filtered = includeHidden ? verbs : verbs.filter(v => v.hidden !== true);
        return [...filtered].sort((a, b) => a.verb.localeCompare(b.verb));
      })
    );
  }

  getRandomExercises(count: number): Observable<any[]> {
    return this.getAllVerbs(false).pipe(
      map(verbs => {
        // Exercise pool: not hidden AND currently enabled
        const studyPool = verbs.filter(v => v.enabled !== false);
        const allEx = studyPool.flatMap(v => 
          (v.exercises || []).map(ex => ({ ...ex, verb: v.verb, meaning: v.meaning }))
        );
        return allEx.sort(() => Math.random() - 0.5).slice(0, count);
      })
    );
  }

  getRandomVerbs(count: number): Observable<Verb[]> {
    return this.getAllVerbs(false).pipe(
      map(verbs => {
        // Study pool: not hidden AND currently enabled
        const studyPool = verbs.filter(v => v.enabled !== false);
        return studyPool.sort(() => Math.random() - 0.5).slice(0, count);
      })
    );
  }
}
