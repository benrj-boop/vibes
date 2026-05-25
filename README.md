# Vibes

A team standup and vibe check tool disguised as a retro RPG. Your weekly check-in doesn't have to feel like a form — it can feel like an adventure.

**[Try the live demo](https://benrj-boop.github.io/vibes/)**

---

## Two Modes

### Classic Mode (`index.html`)

A quick, beautiful form-based check-in. Pick your name, choose a vibe emoji, answer a few prompts (how are you feeling? what are you proud of?), and submit. Everyone's vibes appear in a live feed. There's a standup sidebar, a lucky phrase generator, and a rotating DJ badge.

### Adventure Mode (`game.html`)

A full Pokemon-style RPG where you walk a pixel character around a custom map. Visit NPC stations to answer check-in prompts as game encounters. Complete your vibe check by exploring the world instead of filling out a form.

---

## Screenshots

> _Coming soon — screenshots of both modes go here._

---

## Setup for Your Own Team

Want to use this with your team? Here's how to get it running in ~10 minutes.

### 1. Fork the repo

Fork this repo on GitHub. Clone it locally if you want to make edits in your editor.

### 2. Customize team names

Both `index.html` and `game.html` have a team roster defined near the top of their `<script>` sections. Search for:

```javascript
const TEAM = ['Ben', 'Karina', 'Terrence', 'Jun', 'Aditya'];
```

Replace those names with your team members. Make sure you update it in **both files**:
- `index.html` (line ~1063)
- `game.html` (line ~120)

### 3. Set up your own Google Sheet (optional)

If you want responses saved to a shared Google Sheet:

1. Create a new blank Google Sheet
2. Go to **Extensions > Apps Script**
3. Paste the contents of `apps-script.gs` into the editor
4. Update the `SHEET_ID` constant in the script to your new sheet's ID
   - The sheet ID is the long string in your sheet's URL: `docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`
5. Click **Deploy > New deployment**
6. Set type to **Web app**
7. Set "Who has access" to **Anyone** (or "Anyone in your organization" for internal use)
8. Click **Deploy** and copy the deployment URL

### 4. Configure the sheet URL

Paste your Apps Script deployment URL into `index.html` where the sheet connection is configured. Look for the fetch/submit logic and set your web app URL there.

### 5. Enable GitHub Pages

1. Go to your forked repo's **Settings > Pages**
2. Set Source to **Deploy from a branch**
3. Select the `main` branch, root `/`
4. Hit Save

Your site will be live at `https://YOUR-USERNAME.github.io/vibes/` within a minute.

### 6. Share the URL with your team

Send them the Pages link. Classic mode is the default landing page. Adventure mode is at `/game.html`.

---

## Controls (Adventure Mode)

| Key | Action |
|-----|--------|
| Arrow keys / WASD | Move your character |
| SPACE | Interact with NPCs and objects |
| ESC | Exit back to Classic mode |

---

## Easter Eggs

There are a few hidden surprises scattered around the map. Explore every corner, try walking into things you probably shouldn't, and see what happens.

---

## Customization Ideas

Some things you might want to tweak for your team:

- **Change the map layout** — the tile map is defined as a 2D array in `game.html`
- **Add or modify NPCs** — each NPC has a position, sprite, and associated check-in prompt
- **Edit the prompts** — change what questions get asked during encounters
- **Add team-specific jokes** — swap in your own inside jokes, catchphrases, or references
- **Modify the emoji set** — the emoji grid in Classic mode is fully customizable
- **Change the lucky phrases** — the random phrases that appear are defined in a `LUCKY_PHRASES` array

---

## Tech

Single-file HTML pages. No build step, no dependencies, no framework. Just vibes.

- `index.html` — Classic mode (form-based check-in)
- `game.html` — Adventure mode (RPG check-in)
- `apps-script.gs` — Google Apps Script for shared sheet backend
- `UX-IMPROVEMENTS.md` — Research notes and improvement roadmap

---

## Credits

Built by APAC PMM at Stripe. Made with vibes.
