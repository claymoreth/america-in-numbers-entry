// Page views. One render function per page; every page is built from the
// verified numbers in data.js and the SVG helpers in charts.js. The global
// state (selected year, archive search) lives in main.js and is passed in.

import { YEARS, SERIES, HEADLINES, EXTRA, archiveRows, formatSeries } from "./data.js";
import { barChart, lineChart, donutChart, gaugeBar } from "./charts.js";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function yearPoints(key) {
  return YEARS.map((y) => ({ label: String(y), value: SERIES[key].values[y] }));
}

function yearOptions(selected) {
  return YEARS.map((y) => `<option value="${y}"${y === selected ? " selected" : ""}>${y}</option>`).join("");
}

export function yearPicker(state) {
  return `<label class="year-picker">Year
    <select id="year-select" aria-label="Select year">${yearOptions(state.year)}</select>
  </label>`;
}

function headlineCard(h, state) {
  const value = h.series ? formatSeries(h.series, state.year) : h.value;
  const shownYear = h.series ? state.year : h.source.match(/(\d{4})/)?.[1] || "";
  return `<article class="card stat-card">
    <h3>${esc(h.label)}</h3>
    <p class="big-num" data-indicator="${h.id}">${esc(value)}</p>
    <p class="card-note">${esc(h.note)}</p>
    <p class="card-source">Source: ${esc(h.source)}${h.series ? ` · showing ${shownYear}` : ""}</p>
  </article>`;
}

function sourceLine(text) {
  return `<p class="chart-source">Source: ${esc(text)}</p>`;
}

export function renderHome(state) {
  const cards = HEADLINES.map((h) => headlineCard(h, state)).join("");
  return `
  <section class="hero">
    <p class="kicker">United States of America · National Statistics</p>
    <h1>America in Numbers</h1>
    <p class="lede">The headline figures for the United States — population, economy, prices, jobs and living standards — with every number sourced and dated. Pick a year and the whole dashboard follows it.</p>
    <div class="hero-controls">${yearPicker(state)}</div>
  </section>
  <section aria-labelledby="pulse-heading">
    <h2 id="pulse-heading">Economic Pulse — ${state.year}</h2>
    <div class="stat-grid">${cards}</div>
  </section>
  <section class="chart-row" aria-labelledby="growth-heading">
    <div class="chart-card">
      <h2 id="growth-heading">Real GDP growth, 2020–${state.year}</h2>
      ${barChart(yearPoints("growth").filter((p) => Number(p.label) <= state.year), { highlight: String(state.year), aria: "Real GDP growth by year" })}
      ${sourceLine("World Bank WDI / U.S. BEA, 2020–2025. The green bar is the selected year.")}
    </div>
    <div class="chart-card">
      <h2>GDP (nominal), 2020–${state.year}</h2>
      ${barChart(yearPoints("gdp").filter((p) => Number(p.label) <= state.year), { highlight: String(state.year), aria: "Nominal GDP by year" })}
      ${sourceLine("World Bank WDI, 2020–2025. Values in $ trillion.")}
    </div>
  </section>
  <section class="chart-row">
    <div class="chart-card">
      <h2>Inflation vs unemployment, 2020–2025</h2>
      ${lineChart(
        [
          { label: "Inflation", color: "#1b7a3d", values: YEARS.map((y) => SERIES.inflation.values[y]) },
          { label: "Unemployment", color: "#0a2540", values: YEARS.map((y) => SERIES.unemployment.values[y]) },
        ],
        YEARS,
        { aria: "Inflation and unemployment lines" },
      )}
      <p class="legend"><span class="swatch green"></span>Inflation (CPI) <span class="swatch navy"></span>Unemployment</p>
      ${sourceLine("IMF WEO, 2020–2025. Annual averages, percent.")}
    </div>
    <div class="chart-card">
      <h2>At a glance — 2025</h2>
      <ul class="fact-list">
        <li><strong>341.8 million</strong> people — the world's 3rd largest population <span class="fact-source">(World Bank WDI, 2025)</span></li>
        <li><strong>$30.8 trillion</strong> GDP — the world's largest economy <span class="fact-source">(IMF WEO / World Bank, 2025)</span></li>
        <li><strong>$90,027</strong> GDP per capita <span class="fact-source">(World Bank, 2025)</span></li>
        <li><strong>78.9 years</strong> life expectancy at birth <span class="fact-source">(World Bank, 2025)</span></li>
        <li><strong>80.2%</strong> of people live in urban areas <span class="fact-source">(World Bank, 2025)</span></li>
      </ul>
      <p><a class="button" href="#/economy">Explore the economy →</a></p>
    </div>
  </section>`;
}

export function renderEconomy(state) {
  return `
  <section class="page-head">
    <h1>Economy</h1>
    <p class="lede">Output, prices and public debt for the United States. Pick a year and the figures and charts follow it.</p>
    <div class="hero-controls">${yearPicker(state)}</div>
  </section>
  <section class="stat-grid">
    <article class="card stat-card"><h3>GDP (nominal)</h3><p class="big-num">${esc(formatSeries("gdp", state.year))}</p><p class="card-note">Rank #1 in the world</p><p class="card-source">Source: IMF WEO / World Bank, ${state.year}</p></article>
    <article class="card stat-card"><h3>GDP per capita</h3><p class="big-num">$90,027</p><p class="card-note">Nominal, 2025</p><p class="card-source">Source: World Bank, 2025</p></article>
    <article class="card stat-card"><h3>Real GDP growth</h3><p class="big-num">${esc(formatSeries("growth", state.year))}</p><p class="card-note">Annual, ${state.year}</p><p class="card-source">Source: World Bank WDI / U.S. BEA, ${state.year}</p></article>
    <article class="card stat-card"><h3>Inflation (CPI)</h3><p class="big-num">${esc(formatSeries("inflation", state.year))}</p><p class="card-note">Annual average, ${state.year}</p><p class="card-source">Source: IMF WEO, ${state.year}</p></article>
  </section>
  <section class="chart-row">
    <div class="chart-card">
      <h2>Real GDP growth, 2020–${state.year}</h2>
      ${barChart(yearPoints("growth").filter((p) => Number(p.label) <= state.year), { highlight: String(state.year), aria: "Real GDP growth by year" })}
      ${sourceLine("World Bank WDI / U.S. BEA, 2020–2025.")}
    </div>
    <div class="chart-card">
      <h2>Inflation (CPI), 2020–2025</h2>
      ${lineChart([{ label: "Inflation", color: "#1b7a3d", values: YEARS.map((y) => SERIES.inflation.values[y]) }], YEARS, { aria: "Inflation line" })}
      ${sourceLine("IMF WEO, 2020–2025. Annual average, percent.")}
    </div>
  </section>
  <section class="chart-card">
    <h2>Public debt and the external balance — 2025</h2>
    ${gaugeBar(124.4, 150, "General government gross debt")}
    ${sourceLine("IMF, 2025.")}
    <ul class="fact-list">
      <li><strong>124.4% of GDP</strong> — general government gross debt <span class="fact-source">(IMF, 2025)</span></li>
      <li><strong>−3.8% of GDP</strong> — current account balance <span class="fact-source">(IMF, 2025)</span></li>
    </ul>
  </section>`;
}

export function renderPeople(state) {
  return `
  <section class="page-head">
    <h1>People</h1>
    <p class="lede">How many people live in the United States, how long they live, and how they live. Pick a year and the population figures follow it.</p>
    <div class="hero-controls">${yearPicker(state)}</div>
  </section>
  <section class="stat-grid">
    <article class="card stat-card"><h3>Population</h3><p class="big-num">${esc(formatSeries("population", state.year))}</p><p class="card-note">Rank #3 in the world</p><p class="card-source">Source: World Bank WDI, ${state.year}</p></article>
    <article class="card stat-card"><h3>Life expectancy at birth</h3><p class="big-num">78.9 years</p><p class="card-note">2025</p><p class="card-source">Source: World Bank, 2025</p></article>
    <article class="card stat-card"><h3>Urban population</h3><p class="big-num">80.2%</p><p class="card-note">Share of total, 2025</p><p class="card-source">Source: World Bank, 2025</p></article>
    <article class="card stat-card"><h3>Land area</h3><p class="big-num">9.83 million sq km</p><p class="card-note">2025</p><p class="card-source">Source: World Bank, 2025</p></article>
  </section>
  <section class="chart-row">
    <div class="chart-card">
      <h2>Population, 2020–${state.year} (millions)</h2>
      ${barChart(yearPoints("population").filter((p) => Number(p.label) <= state.year), { highlight: String(state.year), aria: "Population by year" })}
      ${sourceLine("World Bank WDI, 2020–2025.")}
    </div>
    <div class="chart-card">
      <h2>Where people live — 2025</h2>
      ${donutChart(80.2, "urban")}
      <p class="chart-caption">80.2% of the population lives in urban areas; 19.8% lives in rural areas.</p>
      ${sourceLine("World Bank, 2025.")}
    </div>
  </section>
  <section class="chart-card">
    <h2>Living standards — 2024</h2>
    <ul class="fact-list">
      <li><strong>10.6%</strong> official poverty rate — 35.9 million people <span class="fact-source">(U.S. Census Bureau, 2024)</span></li>
      <li><strong>$83,730</strong> median household income <span class="fact-source">(U.S. Census Bureau, 2024)</span></li>
      <li><strong>78.9 years</strong> life expectancy at birth <span class="fact-source">(World Bank, 2025)</span></li>
    </ul>
  </section>`;
}

export function renderLabour(state) {
  return `
  <section class="page-head">
    <h1>Labour</h1>
    <p class="lede">Jobs, unemployment and participation in the United States. Pick a year and the figures follow it.</p>
    <div class="hero-controls">${yearPicker(state)}</div>
  </section>
  <section class="stat-grid">
    <article class="card stat-card"><h3>Unemployment rate</h3><p class="big-num">${esc(formatSeries("unemployment", state.year))}</p><p class="card-note">Annual, ${state.year}</p><p class="card-source">Source: IMF WEO, ${state.year}</p></article>
    <article class="card stat-card"><h3>Labour force participation</h3><p class="big-num">62.4%</p><p class="card-note">2025</p><p class="card-source">Source: U.S. Bureau of Labor Statistics, 2025</p></article>
    <article class="card stat-card"><h3>Median household income</h3><p class="big-num">$83,730</p><p class="card-note">2024</p><p class="card-source">Source: U.S. Census Bureau, 2024</p></article>
    <article class="card stat-card"><h3>Poverty rate (official)</h3><p class="big-num">10.6%</p><p class="card-note">35.9 million people, 2024</p><p class="card-source">Source: U.S. Census Bureau, 2024</p></article>
  </section>
  <section class="chart-row">
    <div class="chart-card">
      <h2>Unemployment rate, 2020–2025</h2>
      ${lineChart([{ label: "Unemployment", color: "#0a2540", values: YEARS.map((y) => SERIES.unemployment.values[y]) }], YEARS, { aria: "Unemployment line" })}
      ${sourceLine("IMF WEO, 2020–2025. Annual, percent.")}
    </div>
    <div class="chart-card">
      <h2>Inflation vs unemployment, 2020–2025</h2>
      ${lineChart(
        [
          { label: "Inflation", color: "#1b7a3d", values: YEARS.map((y) => SERIES.inflation.values[y]) },
          { label: "Unemployment", color: "#0a2540", values: YEARS.map((y) => SERIES.unemployment.values[y]) },
        ],
        YEARS,
        { aria: "Inflation and unemployment lines" },
      )}
      <p class="legend"><span class="swatch green"></span>Inflation (CPI) <span class="swatch navy"></span>Unemployment</p>
      ${sourceLine("IMF WEO, 2020–2025. Annual averages, percent.")}
    </div>
  </section>
  <section class="chart-card">
    <h2>Reading the labour market</h2>
    <p>Unemployment peaked at 8.1% in 2020, fell to 3.6% in 2023, and stood at 4.3% in 2025. The labour force participation rate was 62.4% in 2025.</p>
    ${sourceLine("IMF WEO, 2020–2025; U.S. Bureau of Labor Statistics, 2025.")}
  </section>`;
}

export function renderArchive(state) {
  const q = (state.query || "").trim().toLowerCase();
  const rows = archiveRows().filter((r) => !q || r.indicator.toLowerCase().includes(q) || String(r.year).includes(q) || r.source.toLowerCase().includes(q) || r.value.toLowerCase().includes(q));
  const body = rows
    .map((r) => `<tr><td>${esc(r.indicator)}</td><td>${r.year}</td><td class="num">${esc(r.value)}</td><td>${esc(r.source)}</td></tr>`)
    .join("");
  return `
  <section class="page-head">
    <h1>Archive</h1>
    <p class="lede">Every figure on this site, year by year, with its source. Search to filter the table live.</p>
  </section>
  <section class="chart-card">
    <label class="search-box">Search the archive
      <input id="archive-search" type="search" placeholder="Try “inflation”, “2021” or “World Bank”" value="${esc(state.query || "")}" aria-label="Search the archive">
    </label>
    <p class="result-count" id="result-count">${rows.length} figure${rows.length === 1 ? "" : "s"} found</p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Indicator</th><th>Year</th><th>Value</th><th>Source</th></tr></thead>
        <tbody id="archive-body">${body || `<tr><td colspan="4">No figures match “${esc(state.query || "")}”. Try another word or year.</td></tr>`}</tbody>
      </table>
    </div>
    <p class="chart-source">Sources: World Bank WDI, IMF WEO, U.S. Bureau of Economic Analysis, U.S. Census Bureau, U.S. Bureau of Labor Statistics. All figures verified 26 November 2026.</p>
  </section>`;
}

export const VIEWS = {
  home: renderHome,
  economy: renderEconomy,
  people: renderPeople,
  labour: renderLabour,
  archive: renderArchive,
};
