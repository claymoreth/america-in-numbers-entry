# America in Numbers

[![make.fun bounty](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![make.fun rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/claymoreth/america-in-numbers-entry/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![make.fun reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/claymoreth/america-in-numbers-entry/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

An original, independent national statistics site for the United States of America. Headline figures for population, economy, prices, jobs and living standards — every number sourced and dated, with hand-drawn SVG charts and five working pages.

## The site

- **Home** — "Economic Pulse" dashboard: 8 headline indicators, real GDP growth and GDP charts, inflation vs unemployment, and an at-a-glance panel.
- **Economy** — GDP, GDP per capita, growth, inflation, public debt (124.4% of GDP) and the current account.
- **People** — population trend, life expectancy, urban share (donut chart) and land area.
- **Labour** — unemployment trend, participation rate, median household income and poverty.
- **Archive** — every figure on the site, year by year, with a live search that filters the table as you type.

Pick a year (2020–2025) and the dashboard, figures and charts follow it. Every chart carries its source and year.

## Sources

All figures were verified live on 26 November 2026 from: World Bank WDI, IMF World Economic Outlook, U.S. Bureau of Economic Analysis, U.S. Census Bureau, and U.S. Bureau of Labor Statistics. No figure is estimated.

## Run it

Static files under `app/` — no build step, no network requests:

```sh
node serve.ts
# open http://localhost:8080
```

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

## License

MIT — see [LICENSE](LICENSE).
