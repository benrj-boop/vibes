// Paste this into Extensions > Apps Script in the Google Sheet
// Then Deploy > New Deployment > Web App > Anyone can access
// Copy the deployment URL and paste it into index.html (SCRIPT_URL variable)

const SHEET_ID = '1-PgVjhu3SUqc89W-U3r-FMW1p098A1o96sNXOslG7b8';
const HEADERS = ['week', 'date', 'name', 'emoji', 'vibeType', 'feeling', 'lookingForward', 'proudOf', 'talkAbout', 'timestamp'];

function doGet(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1).filter(r => r[0] !== '');

  // Optional date filter for performance
  const dateFilter = e && e.parameter && e.parameter.date ? e.parameter.date : null;

  let result = rows.map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });

  if (dateFilter) {
    result = result.filter(r => r.date === dateFilter);
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  const payload = JSON.parse(e.postData.contents);

  // Ensure headers exist
  const currentHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (currentHeaders[0] === '' || currentHeaders.join('') === '') {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }

  if (payload.action === 'save') {
    const { week, date, name, emoji, vibeType, feeling, lookingForward, proudOf, talkAbout } = payload;
    const timestamp = new Date().toISOString();
    const data = sheet.getDataRange().getValues();
    const headers = data[0];

    // Find column indices
    const colIdx = {};
    headers.forEach((h, i) => colIdx[h] = i);

    // Upsert: one entry per person per date (latest wins)
    let found = false;
    for (let i = 1; i < data.length; i++) {
      if (data[i][colIdx['date']] === date && data[i][colIdx['name']] === name) {
        // Update existing row
        const rowNum = i + 1;
        const rowData = [week, date, name, emoji || '', vibeType || '', feeling || '', lookingForward || '', proudOf || '', talkAbout || '', timestamp];
        sheet.getRange(rowNum, 1, 1, rowData.length).setValues([rowData]);
        found = true;
        break;
      }
    }

    if (!found) {
      const rowData = [week, date, name, emoji || '', vibeType || '', feeling || '', lookingForward || '', proudOf || '', talkAbout || '', timestamp];
      sheet.appendRow(rowData);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (payload.action === 'clear') {
    const { date, name } = payload;
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const colIdx = {};
    headers.forEach((h, i) => colIdx[h] = i);

    for (let i = 1; i < data.length; i++) {
      if (data[i][colIdx['date']] === date && data[i][colIdx['name']] === name) {
        sheet.deleteRow(i + 1);
        break;
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ error: 'unknown action' }))
    .setMimeType(ContentService.MimeType.JSON);
}
