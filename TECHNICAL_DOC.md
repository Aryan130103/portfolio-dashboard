# Technical Document

Main problems in this project and what I did about them.

## No official API
Yahoo Finance and Google Finance both have no public API, so I had to use other ways. For the price (CMP) I used the `yahoo-finance2` package, which is unofficial but works. For P/E and EPS I download the Google Finance page and read the numbers out of the HTML with `cheerio`.

The problem with scraping is that Google can change the page any day and my code will stop finding the values. So if Google gives nothing, P/E and EPS are taken from Yahoo instead.

## Rate limiting
If I call these sites too much they can block me, so I did three things:
- a small cache in `lib/cache.ts`: prices are saved for 10 seconds and P/E/EPS for 5 minutes. If a new fetch fails, the old saved value is used
- Google pages are fetched 5 at a time instead of all 26 together
- Yahoo prices are fetched 10 stocks at a time (batching)

The page asks for prices every 15 seconds but P/E and EPS only every 5 minutes, because they hardly change during the day.

## NSE and BSE codes
Some stocks have an NSE name (HDFCBANK) and some only a BSE number (532174). Yahoo wants `.NS` or `.BO` after the code and Google wants `:NSE` or `:BOM`. I wrote two small functions in `lib/stocks.ts` which make the right symbol from the exchange and code.

## Yahoo gave no price for BSE number codes
For the BSE stocks I first used the number code from the excel, like `532174.BO`. Yahoo gave prices for all NSE stocks but nothing for these, so 21 of 26 stocks showed N/A. I tried asking each stock separately (in batches of 10) and the result was the same, so the problem was the number codes. The fix was to add a `yahoo` ticker in `portfolio.json` for these stocks (like `ICICIBANK.NS`), which `lib/stocks.ts` uses first. Google still uses the BSE number code.

## A ticker that changed
LTIMindtree showed N/A even though it is an NSE stock. The company was renamed to LTM and the NSE symbol changed from `LTIM` to `LTM` on 27 Feb 2026, so the old ticker had no data. I updated the code in `portfolio.json`.

## TypeScript error in the build
`npm run dev` worked but `npm run build` failed with "Parameter 'r' implicitly has an 'any' type". The reason was that my cache function lost the type of the Yahoo result, so TypeScript did not know what `r` was. I fixed it by giving the result a type (`any[]`) at first, and later the code was changed to fetch each stock separately with `getPrice()`, which has an explicit return type. After this the build passed with no type or lint errors.

## Wrong data in the excel sheet
Some rows in the excel had wrong codes, for example Tata Consumer had the code of TCS. I corrected these in `data/portfolio.json`. Savani Financials has no P/E and EPS data at all, so it shows N/A.

## Missing prices
When a price does not come, showing 0 would make it look like a huge loss. So I show N/A, and that stock is left out of the sector present value and gain/loss until its price comes.

## Performance
- `React.memo` on the table and chart, so only the sector that changed is drawn again
- `useMemo` for the calculations, and table columns are defined outside the component
- prices and P/E/EPS are two different API routes, so slow Google scraping does not hold up the 15 second price update

## Errors
If a request fails the old data stays on the screen and a red message is shown, so the page never goes blank. Stocks without data show N/A.

## Security
There are no API keys. The API routes only read stocks from `portfolio.json`, the browser can't send its own symbols, so nobody can use my API to look up other stocks.

## Data accuracy
Since the data is unofficial it can be wrong or delayed, so there is a disclaimer at the bottom of the page.

## What I would add next
WebSockets for live prices, Redis for the cache on Vercel, sorting and filtering in the table, and tests for the calculations.
