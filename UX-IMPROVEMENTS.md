# UX Research: Vibe Check (Game + Classic Mode)

Research date: 2026-05-22
Researcher: Claude (UX playthrough analysis)

---

## P0 — Must Fix Before Sharing

### 1. Game canvas is not responsive (game.html)
The game container is hardcoded to 720x540px with `overflow: hidden` on body. On smaller laptops (13" Macbook) or if someone has browser zoom, content clips or overflows. No scaling logic exists. On mobile devices, the game is completely unusable (no touch input, fixed pixel dimensions).

**Impact:** Anyone on a non-standard screen size has a broken experience.

### 2. Team names are hardcoded — no way for other managers to configure
`TEAM = ['Ben', 'Karina', 'Terrence', 'Jun', 'Aditya']` appears in both files with no configuration UI. A manager wanting to use this with their own team would need to edit raw HTML.

**Impact:** Blocks the stated goal of sharing with other Stripe managers entirely.

### 3. No indication that game data flows to classic mode
The game saves to the same `localStorage` key (`vibecheck-feed`) as classic mode, which is good. But there is zero UI telling the user this happened successfully, and no way for the manager to know which team members used game mode vs. classic mode.

**Impact:** Manager cannot trust the tool is working. Team members may double-submit.

### 4. Text input in game mode has no visual affordance or mobile keyboard support
Text entry during "battle" encounters uses raw keydown listeners on a hidden input. There is no visible text cursor placeholder, no indication of character limit, and on mobile the keyboard will never appear. The instruction "TYPE your answer" appears only at the bottom of the screen in small gray text.

**Impact:** Users may not realize they can type, or may be confused about how to submit.

### 5. ESC from overworld silently exits to classic mode with no confirmation
Pressing Escape during gameplay (a common "I wonder what this does" key) immediately redirects to index.html with no "are you sure?" prompt and no save of partial progress.

**Impact:** Users lose all progress with no warning. Extremely frustrating.

---

## P1 — Should Fix

### 6. Intro sequence is too long and unskippable in early phases
The intro has a 2.3-second auto-walk, 0.7-second flash sequence, then 2.5-second text reveal before the user can interact. Total: ~5.5 seconds of pure watching. The walk phase cannot be skipped at all. After that, there are 4 more dialogue boxes to click through before gameplay begins.

**Recommendation:** Make the entire intro skippable with a single SPACE press. Add "SPACE to skip" hint during intro.

### 7. No progress save — refreshing the page loses everything
Game state (badges earned, which NPCs visited, text entered so far) is entirely in JS memory. If the user accidentally refreshes, navigates away, or their browser tab crashes, all progress is lost. Only the final submission is saved to localStorage.

**Recommendation:** Save partial progress to localStorage after each station.

### 8. No visual map/minimap showing station locations
The overworld has 5 NPCs scattered across a 30x15 tile map. A new user has no idea where stations are or how to find them. The exclamation marks help but are only visible when relatively close on screen.

**Recommendation:** Add a simple progress sidebar or minimap showing station locations and completion status.

### 9. Classic mode sidebar stacks below content on mobile (900px breakpoint)
At mobile widths, the standup sidebar moves above the check-in form (order: -1). This means the manager view shows first but the team member's form is pushed below the fold.

**Recommendation:** Make sidebar ordering context-aware. Team members should see the form first; managers should see the sidebar first (or add a role toggle).

### 10. No "who's checked in" visibility in either mode
The standup queue only shows people who have submitted today, but there's no quick visual for "3/5 team members have checked in." A manager doesn't know if they should wait for more people.

**Recommendation:** Add a completion counter (e.g., "3/5 checked in") prominently displayed.

### 11. Battle screen emoji picker requires keyboard — no click/touch
The emoji picker in game mode is navigated entirely with arrow keys. No mouse/touch interaction is supported. Given the game is played on individual devices during a meeting, some people may be on tablets or may simply prefer clicking.

**Impact:** Accessibility issue for anyone not comfortable with keyboard-only navigation.

### 12. Word-wrap bug in dialogue box
The dialogue box splits text at exactly 52 characters with no word-boundary awareness. Long NPC names or compound words will be split mid-word.

### 13. No error handling for localStorage quota or private browsing
If localStorage is full or unavailable (Safari private browsing), the app silently fails with no user feedback.

---

## P2 — Nice to Have (Polish & Delight)

### 14. Add sound effects
Even simple Web Audio API beeps would dramatically increase game feel:
- Menu selection blip
- Dialogue advance click
- Battle transition whoosh
- Badge earned jingle
- Completion fanfare

### 15. Walking speed feels slightly slow
Player movement is 3px per frame on a 24px tile grid = 8 frames (133ms) per tile. For a weekly tool where you visit 5 stations, this adds up. Consider 4px/frame.

### 16. Completion screen "SPACE to play again" reloads the page
This feels abrupt. Better: return to title screen, or show a summary of what was submitted with option to edit.

### 17. No weekly rotation or freshness
The map, NPCs, prompts, and flow are identical every week. Consider:
- Rotating NPC positions each week
- Seasonal/weekly themes (colors, decorations)
- Random "encounter" events on certain tiles
- A rotating "bonus question" that changes weekly

### 18. Achievement system is one-dimensional
Badges are earned in a single session and reset. Consider persistent achievements:
- Streak counter (checked in 4 weeks in a row)
- Speed badge (completed in under 60 seconds)
- Explorer badge (found the SnippetBot easter egg)
- Consistent badge (used same emoji 3 weeks running)

### 19. No multiplayer/social presence
You cannot see who else is currently in the game or who has completed their check-in. Ideas:
- Show other team members' sprites on the overworld (ghost/NPC versions)
- Live "X just earned a badge" notifications
- Post-completion: show the team's emoji wall

### 20. SnippetBot easter egg is invisible
The trigger tile (1, 11) has no visual hint. The easter egg is delightful but nearly impossible to discover. Consider a subtle visual cue (e.g., a slightly different colored tile, or a flickering pixel).

### 21. Classic mode particle canvas runs continuously
The floating emoji particle background runs `requestAnimationFrame` forever even when the tab is in the background, consuming battery/CPU on team members' machines.

### 22. Add a "shuffle order" button to standup sidebar
Managers often want to randomize speaking order to avoid always going alphabetically.

### 23. Export format is markdown only
Consider adding a Slack-formatted export or direct Slack webhook integration for posting the weekly summary to a channel.

### 24. No dark/light mode toggle in classic
Game mode is always dark. Classic mode is always dark. Some users in bright offices may want a light mode option.

### 25. The "lucky spin" in classic mode could be more game-like
The current implementation just picks a random emoji/phrase with a shake animation. Adding a brief slot-machine style roll animation would make it more satisfying.

---

## Design System Proposal

### Color Palette

Both modes should share a unified palette. Currently game uses a GBC-inspired palette (`PAL` object) while classic uses a separate purple/indigo scheme. Proposed unified system:

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0f0f23` | Page/app background |
| `--bg-surface` | `#1a1a2e` | Cards, panels, dialogs |
| `--bg-elevated` | `#2a2a4e` | Hover states, active items |
| `--border-default` | `#333333` | Card borders, separators |
| `--border-active` | `#667eea` | Focus rings, active borders |
| `--text-primary` | `#e0e0e0` | Body text |
| `--text-secondary` | `#888888` | Labels, hints |
| `--text-muted` | `#555555` | Placeholders, disabled |
| `--accent-primary` | `#667eea` | Primary actions, links |
| `--accent-secondary` | `#764ba2` | Selected states, highlights |
| `--accent-gradient` | `linear-gradient(135deg, #667eea, #764ba2)` | CTAs, headers |
| `--success` | `#22c55e` | Completion, done states |
| `--warning` | `#f8d030` | Badges, attention |
| `--error` | `#ef4444` | Delete, danger actions |

Game-specific additions (GBC overlay palette):
| Token | Value | Usage |
|-------|-------|-------|
| `--game-grass` | `#2d8b4e` | Overworld grass base |
| `--game-path` | `#d4a76a` | Walkable paths |
| `--game-water` | `#3080c0` | Water tiles |
| `--game-ui-bg` | `#f8f8f0` | Dialogue boxes, battle UI |
| `--game-ui-text` | `#081820` | Text on UI panels |

### Typography

| Context | Font | Size | Weight |
|---------|------|------|--------|
| Game UI | `monospace` (system) | 11px base, 13px headings | 400 |
| Classic headings | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | 2rem (h1), 1rem (h2) | 600 |
| Classic body | Same stack | 0.85-0.95rem | 400-500 |
| Labels/caps | Same stack | 0.7-0.8rem, uppercase, letter-spacing 0.04em | 600 |
| Game title screen | `monospace` | 28px | 700 |

**Consistency issue:** Game uses monospace everywhere (correct for pixel aesthetic). Classic uses system sans-serif (correct for form UI). These are intentionally different and that is fine — the mode toggle makes the context switch clear.

### Spacing Scale

Adopt a 4px base unit:
- `--space-xs`: 4px (0.25rem)
- `--space-sm`: 8px (0.5rem)
- `--space-md`: 12px (0.75rem)
- `--space-lg`: 16px (1rem)
- `--space-xl`: 24px (1.5rem)
- `--space-2xl`: 32px (2rem)

### Component Patterns (shared)

**Cards/Panels:**
- Background: `--bg-surface`
- Border: 1px solid `--border-default`
- Border-radius: 16px (classic), 0px (game — pixel aesthetic)
- Padding: `--space-xl`

**Buttons (classic):**
- Primary: gradient background, white text, 12px radius, 1rem padding
- Secondary: transparent bg, border `--border-default`, rounded
- States: hover lifts with shadow, disabled 50% opacity

**Dialogue boxes (game):**
- Black outer border (3px)
- White inner fill
- Inner stroke border (2px, 6px inset)
- Monospace text at 11px

**Transitions:**
- Classic: 0.15-0.2s ease for hover/focus states
- Game: frame-based (screen wipes, flash effects) — no CSS transitions
- Mode switch (game <-> classic): should add a brief fade transition

### Responsive Breakpoints

| Breakpoint | Behavior |
|-----------|----------|
| > 1200px | Classic: 3-column (instructions + form + sidebar) |
| 900-1200px | Classic: 2-column (form + sidebar), hide instructions |
| < 900px | Classic: single column, sidebar above form |
| Game mode | Should scale canvas to fit viewport width (currently does not) |

### Accessibility Minimums

- All interactive elements need visible focus states (currently missing in game mode entirely)
- Color contrast: most text passes WCAG AA but `--text-muted` (#555 on #1a1a2e) fails — bump to #777
- Game mode needs ARIA live regions for screen reader announcements of state changes
- Tab order in classic mode is logical; game mode has no tab navigation at all

---

## Integration Issues (Game <-> Classic)

| Concern | Status | Notes |
|---------|--------|-------|
| Data format compatibility | Working | Both write identical `{name, vibe, type, feeling, lookingForward, proudOf, talkAbout, time}` objects to `vibecheck-feed` |
| Standup sidebar shows game submissions | Working | Sidebar reads from same localStorage key |
| Discussion items from game surface in sidebar | Working | `talkAbout` field is properly populated |
| Manager can see game vs. classic source | Missing | No field distinguishes which mode was used |
| Partial game progress visible to manager | Missing | Only completed game sessions are saved |
| Name in game must match classic | Fragile | Both use the same TEAM array but game stores selected name differently than classic (no localStorage persistence of name in game) |
| Duplicate submissions | Possible | User can submit via classic AND game in same day; no dedup logic |

---

## Summary: Top 5 Actions for Shareability

1. **Add team configuration** — URL params, config object, or a setup screen where managers enter team names
2. **Make game responsive** — Scale canvas to viewport, add basic touch controls
3. **Add completion visibility** — "3/5 checked in" counter, source indicator (game/classic)
4. **Shorten intro, save progress** — Let people skip intro; persist partial state
5. **Add sound** — Even 3-4 simple tones would make the game feel 10x more polished
