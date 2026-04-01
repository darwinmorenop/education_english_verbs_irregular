import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintService } from '../../services/print.service';

@Component({
  selector: 'app-verb-print',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="print-container" *ngIf="data()">
      <div class="header">
        <div class="student-info">
          <span>Name: ________________________________</span>
          <span>Date: ________________</span>
        </div>
        <div class="test-title">
          <h2>{{ data()?.title }}</h2>
        </div>
      </div>

      <div class="content">
        <!-- SENTENCES MODE (standalone) -->
        <div *ngIf="data()?.mode === 'sentences'" class="sentences-list">
          <div *ngFor="let ex of data()?.items; let i = index" class="sentence-item">
            <span class="num">{{ i + 1 }}.</span>
            <span class="sentence">{{ formatSentence(ex.sentence) }}</span>
            <span class="verb-cue">({{ ex.verb }})</span>
          </div>
        </div>

        <!-- FORMS MODE (standalone) -->
        <div *ngIf="data()?.mode === 'forms'" class="forms-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Infinitive</th>
                <th>Past Simple</th>
                <th>Past Participle</th>
                <th>Meaning (ES)</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let ch of data()?.items; let i = index">
                <td>{{ i + 1 }}</td>
                <td>{{ ch.visibleFormIndex === 0 ? ch.verb.forms.infinitive : '________________' }}</td>
                <td>{{ ch.visibleFormIndex === 1 ? ch.verb.forms.past : '________________' }}</td>
                <td>{{ ch.visibleFormIndex === 2 ? ch.verb.forms.participle : '________________' }}</td>
                <td>{{ ch.visibleFormIndex === 3 ? ch.verb.meaning?.[0] : '________________' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- COMPOSITE MODE -->
        <div *ngIf="data()?.mode === 'composite'" class="composite-layout">
          <!-- Sentences Section -->
          <div class="section-block">
            <h3 class="section-title">Part 1: Complete the Sentences</h3>
            <div class="sentences-list">
              <div *ngFor="let s of data()?.items?.sentences; let i = index" class="sentence-item">
                <span class="num">{{ i + 1 }}.</span>
                <span class="sentence">{{ formatSentence(s.sentence) }}</span>
                <span class="verb-cue">({{ s.verb }})</span>
              </div>
            </div>
          </div>

          <!-- Forms Section -->
          <div class="section-block" style="margin-top: 3rem;">
            <h3 class="section-title">Part 2: Verb Conjugations</h3>
            <div class="forms-table">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Infinitive</th>
                    <th>Past Simple</th>
                    <th>Past Participle</th>
                    <th>Meaning (ES)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let f of data()?.items?.forms; let i = index">
                    <td>{{ i + 1 }}</td>
                    <td>{{ f.visibleFormIndex === 0 ? f.verb.forms.infinitive : '________________' }}</td>
                    <td>{{ f.visibleFormIndex === 1 ? f.verb.forms.past : '________________' }}</td>
                    <td>{{ f.visibleFormIndex === 2 ? f.verb.forms.participle : '________________' }}</td>
                    <td>{{ f.visibleFormIndex === 3 ? f.verb.meaning?.[0] : '________________' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>Irregular Verbs Mastery - Educational Platform</p>
      </div>
    </div>
  `,
  styles: [`
    .print-container {
      font-family: 'Times New Roman', serif;
      color: black;
      width: 100%;
      background: white;
    }

    .header {
      margin-bottom: 2rem;
      border-bottom: 2px solid black;
      padding-bottom: 1rem;
    }

    .student-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      font-weight: bold;
    }

    .test-title {
      text-align: center;
      h2 { margin: 0; font-size: 1.5rem; text-transform: uppercase; letter-spacing: 1px; }
    }

    .section-title {
      font-size: 1.2rem;
      border-bottom: 1px solid #ddd;
      padding-bottom: 0.3rem;
      margin-bottom: 1rem;
      color: #333;
    }

    .content {
      margin-bottom: 3rem;
    }

    /* Sentences Styles */
    .sentences-list {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }

    .sentence-item {
      font-size: 1.1rem;
      line-height: 1.4;
      display: flex;
      gap: 0.5rem;
      align-items: baseline;
      
      .num { font-weight: bold; min-width: 1.5rem; }
      .verb-cue { font-style: italic; color: #333; margin-left: 0.5rem; white-space: nowrap; }
    }

    /* Forms Styles */
    .forms-table {
      width: 100%;
      
      table {
        width: 100%;
        border-collapse: collapse;
        
        th, td {
          border: 1px solid black;
          padding: 0.6rem;
          text-align: center;
          font-size: 1rem;
        }

        th {
          background: #f0f0f0;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 0.8rem;
        }

        td:first-child { width: 30px; font-weight: bold; background: #fafafa; }
      }
    }

    .footer {
      border-top: 1px solid #ccc;
      padding-top: 1rem;
      text-align: center;
      font-size: 0.8rem;
      font-style: italic;
    }
  `]
})
export class VerbPrintComponent {
  private printService = inject(PrintService);
  data = this.printService.printData;

  formatSentence(sentence: string): string {
    // Replace the gap placeholder with a long line for printing
    return sentence.replace('____', '________________________');
  }
}
