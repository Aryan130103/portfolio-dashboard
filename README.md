**Live demo:** https://portfolio-dashboard-nu-one.vercel.app/

# Portfolio Dashboard

Dashboard for my stock portfolio, made with Next.js, TypeScript and Tailwind. It shows live price (CMP) from Yahoo Finance and P/E + EPS from Google Finance. This is my solution for the Octa Byte case study.

**Project Walkthrough:** https://www.loom.com/share/9d43e10d8eb54fc0a27c3ced21d26ac1

## What it does
- shows all stocks in a table (react-table), grouped by sector
- each sector has its own total investment, present value and gain/loss
- prices update by themselves every 15 seconds
- gain is green, loss is red
- pie chart of investment per sector (recharts)
- if some data is not available it shows N/A and an error message
- works on mobile, the table scrolls sideways

## Run it
```bash
npm install
npm run dev
```
then open http://localhost:3000. You need Node 18 or newer. No API keys needed.

For production: `npm run build` and then `npm start`.

## Files
- `app/page.tsx` the main page, also has the 15 sec timer
- `app/api/quotes/route.ts` gets prices from Yahoo (one request per stock, 10 at a time)
- `app/api/fundamentals/route.ts` gets P/E and EPS (Google, and Yahoo if Google fails)
- `components/` table, summary cards, chart, error banner
- `lib/` types, calculations, cache, symbol helpers, google scraping
- `data/portfolio.json` my stocks from the excel sheet

## Changing stocks
Edit `data/portfolio.json`. For NSE stocks put the ticker like `HDFCBANK`, for BSE stocks put the number like `532174`. If Yahoo gives no price for a stock, add a `"yahoo": "TICKER.NS"` field for it.

## Things to know
- Yahoo and Google don't have official APIs, so the data can be late or wrong. Don't use it for real trading.
- Google can change their page and then the scraping breaks. Yahoo is the backup for that.
- The cache is stored in memory, so on Vercel every instance has its own cache.
- Sold stocks from the excel sheet (Infosys, Happiest Minds, EaseMyTrip) are not included.

Challenges and how I solved them are in `TECHNICAL_DOC.md`.
