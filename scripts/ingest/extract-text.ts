import * as cheerio from "cheerio";
import { compactWhitespace } from "./utils";

export async function extractText(
  bytes: Uint8Array,
  contentType: string,
  url: string,
): Promise<string> {
  if (contentType.includes("pdf") || url.toLowerCase().endsWith(".pdf")) {
    return extractPdfText(bytes);
  }

  return extractHtmlText(bytes);
}

function extractHtmlText(bytes: Uint8Array): string {
  const $ = cheerio.loadBuffer(Buffer.from(bytes));

  $("script, style, noscript, svg, iframe").remove();

  // Keep useful navigation/menu link text, but discard obvious page chrome.
  $("footer").remove();

  const root = $("main").length ? $("main") : $("body");
  return compactWhitespace(root.text());
}

async function extractPdfText(bytes: Uint8Array): Promise<string> {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const loadingTask = getDocument({ data: bytes, verbosity: 0 });
  const pdf = await loadingTask.promise;
  const pages: string[] = [];

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const text = content.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .filter(Boolean)
        .join(" ");
      pages.push(text);
      page.cleanup();
    }
  } finally {
    await loadingTask.destroy();
  }

  return compactWhitespace(pages.join("\n\n"));
}
