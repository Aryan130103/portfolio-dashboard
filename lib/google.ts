import * as cheerio from "cheerio";

// google finance has no api so I read the values from the page html
function toNumber(text: string) {
  const n = parseFloat(text.replace(/,/g, ""));
  return isNaN(n) ? null : n;
}

export async function getGoogleData(symbol: string): Promise<{ pe: number | null; eps: number | null }> {
  const res = await fetch("https://www.google.com/finance/quote/" + symbol + "?hl=en", {
    headers: { "User-Agent": "Mozilla/5.0" },
    cache: "no-store",
  });
  const $ = cheerio.load(await res.text());

  let pe: number | null = null;
  let eps: number | null = null;

  // P/E is inside the stats boxes
  $("div.gyFHrc").each((i, el) => {
    if ($(el).find(".mfs7Fc").text().trim() === "P/E ratio") {
      pe = toNumber($(el).find(".P6K39c").text());
    }
  });

  // EPS is in the income statement table
  $("tr").each((i, row) => {
    const cells = $(row).find("td");
    if (eps === null && cells.first().text().includes("Earnings per share")) {
      eps = toNumber(cells.eq(1).text());
    }
  });

  return { pe, eps };
}
