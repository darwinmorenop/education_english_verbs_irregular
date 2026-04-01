# Visibility Logic (Dual-Tier Visibility)

The project implements a two-tier visibility model to decouple the "Source of Truth" from the "Active Study Material".

## Visibility Flags
Each verb in the JSON database contains two boolean flags:
*   `enabled`: (Default: `true`) Controls if the verb belongs to the current "Study Pool".
*   `hidden`: (Default: `false`) Controls if the verb exists in the public-facing UI.

## Visibility Matrix
| State | Visibility in Table/Dict | Inclusion in Exercises | Use Case |
| :--- | :---: | :---: | :--- |
| `enabled: true`, `hidden: false` | ✅ Yes | ✅ Yes | **Standard**: Active and testable material. |
| `enabled: false`, `hidden: false` | ✅ Yes (Dashed) | ❌ No | **Dictionary Only**: For reference, but not for testing. |
| `enabled: true`, `hidden: true` | ❌ No | ❌ No | **Archive**: Hidden from students, kept in DB. |
| `enabled: false`, `hidden: true` | ❌ No | ❌ No | **Archive**: Strictly hidden. |

## Visual Feedback (Admin & UI)
*   **Disabled Studing**: Verbs with `enabled: false` appear with a dashed border and grayscale effect in the Verb Table and Admin Portal.
*   **Hidden Status**: Verbs with `hidden: true` appear with low opacity (ghost effect) and italicized font in the Admin Portal, but are completely removed from all other views.
