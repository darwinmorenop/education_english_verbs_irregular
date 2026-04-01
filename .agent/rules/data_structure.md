# Data Structure & JSON Storage

The Irregular Verb database is partitioned by letter to optimize performance and loading times.

## File Hierarchy
Each letter file is stored at:
`public/verbs/[A-Z].json` (e.g., `public/verbs/A.json`).

## JSON Schema (Verb Interface)
A typical verb entry follows this structure:

```json
{
  "id": "a_1774973055214", // Unique ID: [letter]_[timestamp]
  "verb": "Arise", 
  "forms": {
    "infinitive": "Arise",
    "past": "Arose",
    "participle": "Arisen"
  },
  "meaning": ["Levantarse", "Surgir"], // Array of translation strings
  "exercises": [
    {
      "sentence": "A problem has [blank] in the project.",
      "answer": "Arisen",
      "tense": "participle", // Must match forms key: 'infinitive' | 'past' | 'participle'
      "translation": "Ha surgido un problema en el proyecto."
    }
  ],
  "enabled": true, // Default: true (Study Pool)
  "hidden": false  // Default: false (Public Visibility)
}
```

## Management Strategy
*   **Alphabetical Partitioning**: `VerbService` loads only the JSON file corresponding to the current search letter.
*   **ID Normalization**: IDs are immutable and are used for tracking in the Admin portal and History systems.
*   **Default Values**: When loading older JSON files, `VerbService` automatically normalizes `enabled` to `true` and `hidden` to `false` if they are missing.
