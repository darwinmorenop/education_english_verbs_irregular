# Exercise Systems & Practice Modes

The platform supports two primary learning modes: `Sentences` (Contextual Practice) and `Forms` (Morphological Drill).

## Exercise Inclusion Hierarchy
Verbs are automatically selected for exercises based on their study status:
1.  **Rule**: Sub-select all verbs where `enabled === true` AND `hidden === false`.
2.  **Priority**: Verbs with `enabled: false` or `hidden: true` are ALWAYS excluded from the randomization engine.

## Sentences Mode (`/sentences`)
*   **Contextual Practice**: Selects `n` random exercise objects from the "Active Pool".
*   **Gap-Filling**: Replaces the correct form (`inf`, `past`, `part`) with a blank.
*   **Hints**:
    *   **Translation**: Shows the Spanish meaning (`ES`) when toggled.
    *   **Tense**: Displays the required form name (e.g., "(Past Simple)") when enabled in the environment.
*   **Scoring**: Tracks successful answers at the bottom of the page.

## Forms Mode (`/forms`)
*   **Morphological Mastery**: Presents a grid of `n` random verbs from the "Active Pool".
*   **Dynamic Blanks**: Randomly hides one of the four columns (`Infinitive`, `Past`, `Participle`, `Meaning`) for each row.
*   **Evaluation**: Requires all forms to be filled correctly before a final check is allowed.

## Environment Configurations
The generation parameters for both modes are controlled via `src/environments/`:
*   `admin.generation.sentencesCount`: Number of sentences provided in a single study session.
*   `admin.generation.formsCount`: Number of verbs included in the morphological grid.
