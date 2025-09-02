import fs from "fs";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const decoded = Buffer.from(
  process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64,
  "base64"
).toString("utf-8");

const credentials = JSON.parse(decoded);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

const spreadsheetId = process.env.SPREADSHEET_ID;

/**
 * Fetch a sheet by name and save as JSON
 */
async function fetchAndSaveSheet(sheetName, outputPath) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetName,
  });

  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log(`⚠️ No data found in "${sheetName}".`);
    return;
  }

  const [headers, ...data] = rows;
  const jsonData = data.map((row) => {
    const entry = {};
    headers.forEach((h, i) => {
      entry[h] = row[i] || "";
    });
    return entry;
  });

  fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
  console.log(`✅ Data from "${sheetName}" written to ${outputPath}`);
}

async function main() {
  await fetchAndSaveSheet("Cartelera", "./src/JSON/currentShows.json");
  await fetchAndSaveSheet("Clases", "./src/JSON/classes.json");
}

main().catch(console.error);
