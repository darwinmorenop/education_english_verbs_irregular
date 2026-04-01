# Admin Portal & Content Management

The Admin portal (`/admin`) serves as the central command for the platform's curriculum.

## Authorization & Security
Access is globally guarded by `environment.admin.enabled`. 
*   **Security Protocol**: If `enabled: false` in `src/environments/`, the router redirects any attempt to `/admin` back to the home page.

## Navigation Modes (Sidebar)
The Admin Sidebar is divided into two operational segments:

1.  **Global Audit Filters**:
    *   **✅ Active Pool**: View ALL verbs (all letters) that are `enabled: true`. This shows the student's current practice universe.
    *   **❌ Disabled Study**: View ALL verbs that are visible in the dictionary but excluded from the practice sessions (`enabled: false`).
    *   **👻 Hidden Database**: View ALL archived verbs that are permanently hidden from any student-facing view (`hidden: true`).
2.  **Sectional Editing (Alphabetical Grid)**:
    *   Selecting a letter loads only the verbs starting with that letter for granular editing and updates.

## Management Tools (Verb Cards)
Each verb card provides the following controls:
*   **🔓/🔒 Study Toggle**: Instantly enables/disables the verb from the exercise Pool.
*   **👁️/👻 Visibility Toggle**: Toggles the `hidden` status for global inclusion/exclusion.
*   **📝 Edit**: Opens a modal to modify ID, forms, meanings, and exercise sentences.
*   **🗑️ Delete**: Removes the verb from the local state for extraction.

## Global Actions (Header)
*   **➕ Add Verb**: Create a new verb with automatic ID generation.
*   **💾 Export JSON**: Copies the entire current state (for the active filter) to the clipboard. Use this to manually update `public/verbs/` files.
*   **🖨️ Generate Print Test**: Creates a high-density, print-friendly assessment using `environment.admin.generation` counts.
