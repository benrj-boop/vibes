# Vibes

Weekly team happiness pulse for APAC PMM. Everyone opens the page, picks their emoji + song, hits save. The DJ rotates each week.

## Setup (one-time, 2 minutes)

1. Open the [APAC PMM Vibes sheet](https://docs.google.com/spreadsheets/d/1-PgVjhu3SUqc89W-U3r-FMW1p098A1o96sNXOslG7b8)
2. Go to **Extensions > Apps Script**
3. Paste the contents of `apps-script.gs` into the editor
4. Click **Deploy > New deployment**
5. Set type = **Web app**, access = **Anyone** (or anyone at Stripe)
6. Click **Deploy** and copy the URL
7. Paste the URL into `index.html` where it says `SCRIPT_URL = ''`
8. Commit + push

## Deploy

Push to GitHub and enable Pages on `main` branch. Share the Pages URL with the team.

Single `index.html` + Google Sheet backend. No build step, no dependencies.

## How it works

- Everyone opens the page on their own device
- Pick an emoji + type a song (2 min)
- Hit **Save** — goes straight to the sheet
- Page auto-refreshes every 30s so you see everyone's picks appear
- **DJ badge** rotates weekly — that person picks the song everyone listens to
- **Clear** resets your entry for this week (history untouched)
- **Copy log** formats the week as markdown for `vibes-log.md`

## Team

- Ben (APAC Lead)
- Karina (AUNZ)
- Terrence (GCN / SEA)
- Jun (Japan)
- Aditya (India)
