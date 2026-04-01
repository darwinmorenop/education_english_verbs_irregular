import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { LetterSelectorComponent } from './components/letter-selector/letter-selector.component';
import { VerbPrintComponent } from './components/verb-print/verb-print.component';
import { filter } from 'rxjs';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, LetterSelectorComponent, VerbPrintComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  showSidebar = true;
  isAdminEnabled = environment.admin.enabled;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const url = this.router.url;
      this.showSidebar = url.includes('/letter');
    });
  }

  isExerciseActive(): boolean {
    const url = this.router.url;
    return url.includes('/sentences') || url.includes('/forms');
  }
}
