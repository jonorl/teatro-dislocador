import type { ClassData, Cartelera, Galeria } from "../types/interfaces"

const SHEETS = {
  classes: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTqRtL9dFk3w4I59sDoH-xMBA_oB8okiuhlBnVObbDbNmSgBpfRF5-kOpDtQEKM7q0b4ZA8wQZto79_/pub?gid=970016621&single=true&output=csv",
  cartelera: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTqRtL9dFk3w4I59sDoH-xMBA_oB8okiuhlBnVObbDbNmSgBpfRF5-kOpDtQEKM7q0b4ZA8wQZto79_/pub?gid=34655187&single=true&output=csv",
  galeria: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTqRtL9dFk3w4I59sDoH-xMBA_oB8okiuhlBnVObbDbNmSgBpfRF5-kOpDtQEKM7q0b4ZA8wQZto79_/pub?gid=1680334417&single=true&output=csv",
};

// 1. Make the parser generic <T>
function parseCSV<T>(csv: string): T[] {
  const lines: string[] = [];
  let currentLine = "";
  let inQuotes = false;

  // Proper CSV split that respects newlines inside quotes
  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    if (char === '"') inQuotes = !inQuotes;
    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (currentLine.trim()) lines.push(currentLine);
      currentLine = "";
      if (char === '\r' && csv[i + 1] === '\n') i++; 
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) lines.push(currentLine);

  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const entry: any = {};
    
    headers.forEach((header, i) => {
      let val = values[i] ?? "";
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1).replace(/""/g, '"');
      }
      entry[header] = val;
    });
    
    return entry as T;
  });
}

function parseCSVLine(line: string): string[] {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char; 
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

async function fetchSheet<T>(url: string): Promise<T[]> {
  const response = await fetch(url);
  const csv = await response.text();
  return parseCSV<T>(csv);
}

export default async function fetchDataFromGoogleSheets() {
  const [classes, cartelera, galeria] = await Promise.all([
    fetchSheet<ClassData>(SHEETS.classes),
    fetchSheet<Cartelera>(SHEETS.cartelera),
    fetchSheet<Galeria>(SHEETS.galeria)
  ]);
  
  return { classes, cartelera, galeria };
}