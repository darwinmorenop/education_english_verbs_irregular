# Extra Features & Special Modules

The platform includes unique utilities for printing and high-performance study.

## Printing & Physical Assessment (`/print`)
The `VerbPrintComponent` provides a dedicated view for physical practice.

*   **Trigger**: Clicking the "Print Test" (Emerald 🖨️) button in Admin or Exercise headers.
*   **Aesthetics**: 
    *   **Clean & Basic**: Strips transparency, gradients, and shadows to save printer ink.
    *   **Density**: Uses a compact layout (`2fr` or `3fr` grid) to fit more content per page.
    *   **Visibility**: Automatically respects the "Active Pool" settings.
*   **Parallel Component**: Works within a separate route (`/print`) to avoid UI clutter.

## Performance & Styling System
The platform leverages modern web design to keep students engaged.

*   **Indigo UI**: Primary utility colors at the Indigo level (`#4f46e5`).
*   **Emerald Printing**: Mint/Emerald colors for all print-related actions.
*   **Glassmorphism**: Use of translucent cards, backdrop filters, and subtle borders.
*   **Micro-animations**: Staggered list animations (`listAnimation`) for all grid items.
*   **SEO Optimization**: Unique IDs for all interactive elements and semantic HTML5 headers.

## Development Environment
Located at `src/environments/`:
*   `admin.enabled`: Global Admin switch.
*   `admin.generation.sentencesCount`: Sentence count for generated tests.
*   `admin.generation.formsCount`: Verb count for generated forms tests.
