# Mens et Manus

Mens et Manus is a lightweight university productivity app prototype with a dashboard, course workspace, calendar, to-dos, notes and idea manager, focus music, analytics timer, social hub, Gmail/Drive mock integrations, and an animated streak pet.

## Run the app now

```bash
npm run dev
```

Then open:

```text
http://127.0.0.1:5173
```

## Package a static copy

```bash
npm run package
```

The packaged app is copied to `dist/` and can be served with:

```bash
python3 -m http.server 5173 -d dist
```

## Verify

```bash
npm run build
npm test
```

## What is included

- LocalStorage-backed state for courses, events, to-dos, notes, captures, active music track, navigation, and timer progress.
- Dashboard with daily discipline quote, current course cards, daily task/event/focus stats, and animated streak pet.
- Streak pet tiers from Day 0 through Day 1000 with dialogue, focus-mode animation, starry/legendary states, orbit/rune visuals, and click-to-cycle dialogue.
- Calendar and to-do workflows with create, toggle, and delete actions.
- Editable Notes & Ideas workspace with course folders, note cards, note body/tag/folder editing, quick note creation, and auto-save.
- Course builder with metadata fields, color picker, icon choices, upload workspace tabs, and document/video viewer placeholder.
- Analytics study timer with start/pause, persisted elapsed time, and focus stats.
- Focus music library with 100 tracks and persistent mini-player display.
- Social, profile/login, Gmail, Drive, floating AI assistant, and quick capture modal screens.
