# Tables & Dictionary (Reference Views)

The reference views provide students with access to the Irregular Verb database for manual study and lookup.

## Verb Table (`/table`)
The `VerbTableComponent` presents a high-density, searchable grid of all available verbs.
*   **Search**: Filters by verb name, meaning, or letter.
*   **Disabled Rows**: Verbs where `enabled: false` are rendered with a `dashed` border and a grayscale effect (`study-disabled` class). 
*   **Rule**: Verbs with `hidden: true` are NEVER rendered in this view.
*   **Layout**: Balanced grid optimized for reading infinitive, past, and participle forms side-by-side.

## Dictionary (`/dict` or `/list`)
The `VerbListComponent` (Dictionary) focuses on alphabetical navigation.
*   **Filtering**: Clicking a letter in the navigation triggers a selective JSON fetch (`VerbService.getVerbsByLetter`).
*   **Visibility**: Letters that contain ONLY hidden verbs should be filtered from the navigation bar (`VerbService.refreshAvailableLetters`).
*   **Cards**: Each verb card provides clear form labels and a popover for Spanish meanings.

## History System (`/history`)
*   **Purpose**: Tracks recent study performance.
*   **Storage**: (Uses local storage or memory, to be documented by specific implementation).
*   **Rule**: History remains private to the user session and tracks correctness by `Verb.id`.
