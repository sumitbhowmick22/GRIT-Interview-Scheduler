# GRIT Interview Scheduler

A clickable prototype for scheduling GRIT Track Badge interviews. Eligible students book a slot, interviewers manage their availability and record outcomes, and the interview team sees who has and hasn't booked. Built for the AI Product Engineer Round 1 assignment.

**Live prototype:** `<paste your Netlify or GitHub Pages link here>`
**Write-up (states, edge cases, data model):** `<paste your doc link here>`

No install, no build step, no backend. Open `index.html` in any browser and it works offline.

---

## What you can do

| Role | Screens | What it does |
|---|---|---|
| **Student** | Home, Book a slot, Badges | See interview status and result, book or change a slot, see the badge earned or not |
| **Interviewer** | My availability, Daily schedule | Open or close time slots, see the day's interviews, record Pass, Fail or Retake later with feedback, mark no-shows |
| **Interview team** | Eligible students | See who has booked and who hasn't, send reminders, flag malpractice on a passed badge |
| **Review screens** | Student messages, Before & after | The three key student messages, and student home, badges and tracker rows before and after a result |

## Try it in two minutes

1. **Student** tab: open **Book a slot**, pick a time, confirm. Home now shows the booking confirmation.
2. **Interviewer** tab: choose Anita Rao, open **Daily schedule**, select Mon 16 Nov. Your booking is in the list.
3. Click **Skip to Mon 16 Nov, 6:00 PM** in the dashed demo bar. Outcome forms open once an interview has started.
4. Try **Retake later** with no feedback to see the validation, then add feedback and record it.
5. Back on **Student**, check Home and Badges. Then look at **Interview team**, **Student messages** and **Before & after**.

Use **Reset demo** to start over.

---

## Student journey states

A student's state is derived from their skill clearances, latest interview and badge. It is never stored, so every screen agrees.

| From | To | What moves it |
|---|---|---|
| Locked | Eligible | Student clears the last skill the badge needs |
| Eligible | Booked | Student books an open slot at least 24 hours away |
| Booked | Eligible | Student cancels (until 12 hours before), interviewer cancels (no attempt used), or no-show (attempt used) |
| Booked | Passed, Retake later or Failed | Interviewer records the outcome. Pass awards the badge. The other two need feedback and set a rebook date (7 or 14 days) |
| Retake later or Failed | Eligible | The rebook date arrives |
| Passed | Revoked | Team flags malpractice and the badge is removed |

## Rules built into the prototype

- Slots can be booked at least 24 hours ahead. Change or cancel is allowed until 12 hours before.
- A slot that was just taken can't be booked again; the student is asked to pick another.
- The outcome form opens only after the interview starts. Feedback is required for Fail and Retake later.
- Rebooking is blocked until the rebook date, and the button shows that date.
- A booked slot can't be closed by the interviewer. They cancel the interview instead, and the student returns to Eligible without losing an attempt.
- Malpractice flagged after a pass revokes the badge, and the student's screens change at once.

## The three student messages

**Booking confirmed**
> You're booked. Your Backend Track interview is on Mon 16 Nov at 11:00 AM with Anita Rao. Join from this page 5 minutes early with your camera on. You can change or cancel until Sun 15 Nov, 11:00 PM.

**Passed**
> You passed the Backend Track interview. Your Backend Track Badge is now on your profile. Anita Rao recorded your result on Mon 16 Nov. The badge stays valid unless malpractice is found later.

**Retake later**
> Not cleared yet. Anita Rao asked you to retake the Backend Track interview. Feedback: "Revisit indexing and query plans." You can book again from Mon 23 Nov. Your cleared skills stay cleared.

Failed and Badge revoked variants are on the **Student messages** screen.

---

## Data model

| Table | Key fields |
|---|---|
| students, interviewers, tracks | id, name, email; tracks add required_skill_ids |
| skill_clearances | student_id, skill_id, status (valid or nullified) |
| availability_slots | id, interviewer_id, starts_at (UTC), state (open, closed, booked) |
| interviews | id, student_id, slot_id, attempt_no, status, outcome, feedback, next_attempt_after |
| badge_awards | id, student_id, track_id, interview_id, status (active or revoked), revoke_reason |

Partial unique indexes allow one booked interview per slot and one per student and track. The prototype keeps this data in memory (`js/data.js`); a production version would use a database with this schema.

## Project structure

```
index.html              Page shell and script order
css/styles.css          Theme tokens (light and dark) and all styles
js/utils.js             Date formatting (IST), escaping, small UI helpers
js/data.js              Seed data and init()
js/state.js             vmFor(): derives the student's journey state; canBook()
js/views-student.js     Student Home, Book a slot, Badges, student messages
js/views-interviewer.js Availability grid and daily schedule with outcome form
js/views-team.js        Interview team tracker
js/views-compare.js     Before & after and Student messages screens
js/actions.js           render(), toast, and ACT: every transition
js/main.js              Starts the app
```

State lives in one object `S`. Screens are functions that return HTML from `S`. A click on any `data-act` element calls the matching function in `ACT`, which updates `S` and calls `render()`.

## Tech and tooling

- Plain HTML, CSS and JavaScript, with no framework or build step. Scripts load in order, so it also runs from `file://`.
- The interface was generated with Claude as the AI coding tool. The states, rules, data model and messages are the product design this prototype demonstrates.
- Offline, fonts fall back to system fonts.

## Assumptions and open questions

- Interviews are 60 minutes, with one interviewer, and the student chooses the time.
- Skill clearances come from the existing contest system.
- The 7 and 14 day rebook periods and a limit of 3 attempts are configurable defaults.
- Open: is Fail final or retryable? Who can flag malpractice, and does a flagged skill revoke every badge that uses it?
