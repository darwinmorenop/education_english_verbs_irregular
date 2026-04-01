import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { VerbService } from '../../services/verb.service';
import { Verb } from '../../models/verb.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verb-table',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './verb-table.component.html',
  styleUrl: './verb-table.component.scss'
})
export class VerbTableComponent implements OnInit {
  private verbService = inject(VerbService);
  
  allVerbs = signal<Verb[]>([]);
  loading = signal(false);
  searchQuery = signal('');

  filteredVerbs = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const v = this.allVerbs();
    if (!q) return v;
    return v.filter(verb => 
      verb.verb.toLowerCase().includes(q) ||
      verb.forms.past.toLowerCase().includes(q) ||
      verb.forms.participle.toLowerCase().includes(q) ||
      (verb.meaning && verb.meaning.some(m => m.toLowerCase().includes(q)))
    );
  });

  ngOnInit() {
    this.loading.set(true);
    this.verbService.getAllVerbs().subscribe({
      next: (verbs) => {
        this.allVerbs.set(verbs);
        this.loading.set(false);
      },
      error: () => {
        this.allVerbs.set([]);
        this.loading.set(false);
      }
    });
  }

  getLanguages(verb: Verb): string[] {
    return verb.meaning ? Object.keys(verb.meaning) : [];
  }
}
