import fs from "fs";

export async function extractText(filepath: string, mimetype: string) {
  if (mimetype === "application/pdf") {
    const pdf = require("pdf-parse");
    const buffer = fs.readFileSync(filepath);

    const data = await pdf(buffer);

    return data.text;
  }

  return fs.readFileSync(filepath, "utf-8");
}
