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
  
  private readonly ENABLED_KEY = 'verbs_enabled_cache';
  private readonly HIDDEN_KEY = 'verbs_hidden_cache';
  
  // Mapping of verb ID to status
  private enabledCache: { [id: string]: boolean } = {};
  private hiddenCache: { [id: string]: boolean } = {};
  
  // Cache the one source of truth
  private allVerbs$ = this.http.get<Verb[]>(this.dataUrl).pipe(
    map(verbs => {
      this.initializeCaches(verbs);
      return verbs.map(v => ({
        ...v,
        enabled: this.enabledCache[v.id] ?? v.enabled ?? true,
        hidden: this.hiddenCache[v.id] ?? v.hidden ?? false
      }));
    }),
    catchError(() => of([])),
    shareReplay(1)
  );
  
  availableLetters = signal<string[]>([]);

  constructor() {
    this.refreshAvailableLetters();
  }

  private initializeCaches(verbs: Verb[]) {
    const storedEnabled = localStorage.getItem(this.ENABLED_KEY);
    const storedHidden = localStorage.getItem(this.HIDDEN_KEY);

    if (storedEnabled) {
      this.enabledCache = JSON.parse(storedEnabled);
    } else {
      // Initialize from file
      verbs.forEach(v => this.enabledCache[v.id] = v.enabled ?? true);
      this.saveEnabledCache();
    }

    if (storedHidden) {
      this.hiddenCache = JSON.parse(storedHidden);
    } else {
      // Initialize from file
      verbs.forEach(v => this.hiddenCache[v.id] = v.hidden ?? false);
      this.saveHiddenCache();
    }
  }

  private saveEnabledCache() {
    localStorage.setItem(this.ENABLED_KEY, JSON.stringify(this.enabledCache));
  }

  private saveHiddenCache() {
    localStorage.setItem(this.HIDDEN_KEY, JSON.stringify(this.hiddenCache));
  }

  updateVerbStatus(id: string, updates: { enabled?: boolean, hidden?: boolean }) {
    if (updates.enabled !== undefined) {
      this.enabledCache[id] = updates.enabled;
      this.saveEnabledCache();
    }
    if (updates.hidden !== undefined) {
      this.hiddenCache[id] = updates.hidden;
      this.saveHiddenCache();
    }
  }

  resetEnabledCache() {
    localStorage.removeItem(this.ENABLED_KEY);
    // Reload logic would be needed or just clear local obj
    this.enabledCache = {};
    window.location.reload(); // Simplest way to re-trigger initialization
  }

  resetHiddenCache() {
    localStorage.removeItem(this.HIDDEN_KEY);
    this.hiddenCache = {};
    window.location.reload();
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
