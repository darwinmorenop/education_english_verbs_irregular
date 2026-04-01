import { Injectable, signal } from '@angular/core';
import { Verb, Exercise } from '../models/verb.model';

export type PrintMode = 'sentences' | 'forms' | 'composite';

interface PrintData {
  mode: PrintMode;
  items: any; // For composite: { sentences: any[], forms: any[] }
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  printData = signal<PrintData | null>(null);

  preparePrint(mode: PrintMode, items: any, title: string) {
    this.printData.set({ mode, items, title });
    // Small delay to ensure the component has time to render before the print dialog opens
    setTimeout(() => {
      window.print();
    }, 200);
  }
}
