// Paste this into Extensions > Apps Script in the Google Sheet
// Then Deploy > New Deployment > Web App > Anyone can access
// Copy the deployment URL and paste it into index.html (SCRIPT_URL variable)

const SHEET_ID = '1-PgVjhu3SUqc89W-U3r-FMW1p098A1o96sNXOslG7b8';

function doGet(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1).filter(r => r[0] !== '');

  const result = rows.map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  const payload = JSON.parse(e.postData.contents);

  if (payload.action === 'save') {
    const { week, date, name, emoji, song } = payload;
    const data = sheet.getDataRange().getValues();

    // Find existing row for this person + week and update, or append
    let found = false;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === week && data[i][2] === name) {
        sheet.getRange(i + 1, 4).setValue(emoji);
        sheet.getRange(i + 1, 5).setValue(song);
        sheet.getRange(i + 1, 6).setValue(new Date().toISOString());
        found = true;
        break;
      }
    }

    if (!found) {
      sheet.appendRow([week, date, name, emoji, song, new Date().toISOString()]);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (payload.action === 'clear') {
    const { week, name } = payload;
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === week && data[i][2] === name) {
        sheet.getRange(i + 1, 4).setValue('');
        sheet.getRange(i + 1, 5).setValue('');
        sheet.getRange(i + 1, 6).setValue('');
        break;
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ error: 'unknown action' }))
    .setMimeType(ContentService.MimeType.JSON);
}
