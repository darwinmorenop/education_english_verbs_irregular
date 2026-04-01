export const BLANK_PLACEHOLDER = '[blank]';

export interface VerbForms {
  infinitive: string;
  past: string;
  participle: string;
}

export interface Exercise {
  sentence: string;
  answer: string;
  tense: string;
  translation?: string;
}

export interface Verb {
  id: string;
  verb: string;
  forms: VerbForms;
  exercises: Exercise[];
  meaning?: string[];
  enabled?: boolean;
  hidden?: boolean;
}
