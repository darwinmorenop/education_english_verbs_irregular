import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VerbService } from '../../services/verb.service';
import { Verb } from '../../models/verb.model';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { VerbCardComponent } from '../../components/verb-card/verb-card.component';

@Component({
  selector: 'app-verb-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, VerbCardComponent],
  templateUrl: './verb-list.component.html',
  styleUrl: './verb-list.component.scss',
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(50, [
            animate('0.4s cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class VerbListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private verbService = inject(VerbService);
  
  verbs = signal<Verb[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  searchQuery = signal('');

  filteredVerbs = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const v = this.verbs();
    if (!q) return v;
    return v.filter(verb => verb.verb.toLowerCase().includes(q));
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const letter = params.get('id') || 'A';
      this.loadVerbs(letter);
    });
  }

  loadVerbs(letter: string) {
    this.loading.set(true);
    this.error.set(null);
    this.verbService.getVerbsByLetter(letter).subscribe({
      next: (data) => {
        this.verbs.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching verbs:', err);
        this.verbs.set([]);
        this.loading.set(false);
        this.error.set(`No verbs found for letter ${letter}`);
      }
    });
  }
}
