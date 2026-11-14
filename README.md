# GRIT Interview Scheduler (prototype)

Clickable prototype for the GRIT interview scheduling assignment. No build step, no server, no internet needed:
open `index.html` in a browser. (Fonts fall back to system fonts when offline.)

Plain scripts are loaded in order, so it also works from `file://`.

## Files

| File | What it holds |
|---|---|
| `index.html` | Page shell and script order |
| `css/styles.css` | Theme tokens (light and dark) and all styles |
| `js/utils.js` | Date and time formatting (IST), escaping, pill and button helpers |
| `js/data.js` | Seed data and `init()`: students, interviewers, slots, interviews, badges |
| `js/state.js` | Student journey state: `vmFor()` derives Eligible, Booked, Passed, Retake later, Failed or Revoked; `canBook()` |
| `js/views-student.js` | Student Home, Book a slot, Badges, and the student messages (`msgFor`) |
| `js/views-interviewer.js` | Availability grid and daily schedule with the outcome form |
| `js/views-team.js` | Interview team tracker (booked vs not booked, reminder, malpractice flag) |
| `js/views-compare.js` | Before and after screens, and the Student messages screen |
| `js/actions.js` | `render()`, toast, and `ACT`: every transition (book, cancel, record outcome, no-show, revoke) |
| `js/main.js` | Starts the app |

## How the pieces connect

State lives in one object `S` (built by `init()`). Screens are functions that return HTML from `S`.
A click on any `data-act` element calls the matching function in `ACT`, which changes `S` and calls `render()`.
The student journey state is never stored; `vmFor()` computes it from interviews and badge awards, so the
student home, interviewer view, team tracker and before/after screens always agree.

## Demo

Student: book a slot. Interviewer: Daily schedule. Use "Skip to Mon 16 Nov, 6:00 PM" in the demo bar, record an outcome,
then check Student Home and Badges, the Interview team tab, Student messages, and Before & after.
