import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin, of, catchError } from 'rxjs';
import { Verb } from '../models/verb.model';

@Injectable({
  providedIn: 'root'
})
export class VerbService {
  private http = inject(HttpClient);
  private baseUrl = 'verbs/';
  private alphabet = 'ABCDEFGHIJKLMNOPQRSTUVW'.split('');
  
  availableLetters = signal<string[]>(['A', 'B', 'C', 'D', 'E']); // Default based on known files

  constructor() {
    this.refreshAvailableLetters();
  }

  refreshAvailableLetters() {
    const requests = this.alphabet.map(letter => 
      this.http.get<Verb[]>(`${this.baseUrl}${letter}.json`).pipe(
        // Available if at least one verb is not hidden
        map(verbs => verbs.some(v => v.hidden !== true) ? letter : null),
        catchError(() => of(null))
      )
    );
    
    forkJoin(requests).pipe(
      map(results => results.filter((r): r is string => r !== null))
    ).subscribe(available => {
      this.availableLetters.set(available);
    });
  }

  getVerbsByLetter(letter: string, includeHidden = false): Observable<Verb[]> {
    return this.http.get<Verb[]>(`${this.baseUrl}${letter.toUpperCase()}.json`).pipe(
      map(verbs => includeHidden ? verbs : verbs.filter(v => v.hidden !== true)),
      catchError(() => of([]))
    );
  }

  getAllVerbs(includeHidden = false): Observable<Verb[]> {
    const requests = this.alphabet.map(letter => 
      this.getVerbsByLetter(letter, includeHidden)
    );
    return forkJoin(requests).pipe(
      map(results => results.flat().sort((a, b) => a.verb.localeCompare(b.verb)))
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
