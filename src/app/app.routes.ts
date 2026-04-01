import { Routes } from '@angular/router';
import { VerbListComponent } from './pages/verb-list/verb-list.component';
import { VerbTableComponent } from './pages/verb-table/verb-table.component';
import { VerbExerciseComponent } from './pages/verb-exercise/verb-exercise.component';
import { VerbFormsComponent } from './pages/verb-forms/verb-forms.component';
import { HistoryComponent } from './pages/history/history.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  { path: '', redirectTo: 'letter/B', pathMatch: 'full' },
  { path: 'letter/:id', component: VerbListComponent },
  { path: 'table', component: VerbTableComponent },
  { path: 'sentences', component: VerbExerciseComponent },
  { path: 'forms', component: VerbFormsComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: 'letter/B' }
];
