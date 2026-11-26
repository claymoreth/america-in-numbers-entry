// AMERICA IN NUMBERS — the single source of every figure on this site.
// All figures were verified live on 26 November 2026 from the sources named
// beside each one. Nothing in this file is estimated, rounded beyond the
// source's own rounding, or invented. Do not add a figure here without a
// named source and year.

export const YEARS = [2020, 2021, 2022, 2023, 2024, 2025];

export const SERIES = {
  growth: {
    label: "Real GDP growth",
    unit: "%",
    source: "World Bank WDI / U.S. BEA",
    values: { 2020: -2.1, 2021: 6.2, 2022: 2.5, 2023: 2.9, 2024: 2.8, 2025: 2.2 },
  },
  inflation: {
    label: "Inflation (CPI, annual average)",
    unit: "%",
    source: "IMF WEO",
    values: { 2020: 1.2, 2021: 4.7, 2022: 8.0, 2023: 4.1, 2024: 3.0, 2025: 2.7 },
  },
  unemployment: {
    label: "Unemployment rate",
    unit: "%",
    source: "IMF WEO",
    values: { 2020: 8.1, 2021: 5.4, 2022: 3.7, 2023: 3.6, 2024: 4.0, 2025: 4.3 },
  },
  population: {
    label: "Population",
    unit: "million",
    source: "World Bank WDI",
    values: { 2020: 332, 2021: 332, 2022: 334, 2023: 337, 2024: 340, 2025: 342 },
  },
  gdp: {
    label: "GDP (nominal)",
    unit: "$ trillion",
    source: "World Bank WDI",
    values: { 2020: 21.4, 2021: 23.7, 2022: 26.1, 2023: 27.8, 2024: 29.3, 2025: 30.8 },
  },
};

// Headline indicators shown on the Home dashboard. A "series" key means the
// card follows the year selector; a "value" means the latest verified year.
export const HEADLINES = [
  { id: "population", label: "Population", series: "population", format: "342 million", note: "Rank #3 in the world", source: "World Bank WDI, 2025" },
  { id: "gdp", label: "GDP (nominal)", series: "gdp", format: "$30.8 trillion", note: "Rank #1 in the world", source: "IMF WEO / World Bank, 2025" },
  { id: "gdp-pc", label: "GDP per capita", value: "$90,027", note: "Nominal, 2025", source: "World Bank, 2025" },
  { id: "growth", label: "Real GDP growth", series: "growth", format: "2.2%", note: "Annual, 2025", source: "World Bank WDI / U.S. BEA, 2025" },
  { id: "inflation", label: "Inflation (CPI)", series: "inflation", format: "2.7%", note: "Annual average, 2025", source: "IMF WEO, 2025" },
  { id: "unemployment", label: "Unemployment rate", series: "unemployment", format: "4.3%", note: "Annual, 2025", source: "IMF WEO, 2025" },
  { id: "poverty", label: "Poverty rate (official)", value: "10.6%", note: "35.9 million people, 2024", source: "U.S. Census Bureau, 2024" },
  { id: "income", label: "Median household income", value: "$83,730", note: "2024", source: "U.S. Census Bureau, 2024" },
];

export const EXTRA = [
  { label: "General government gross debt", value: "124.4% of GDP", year: 2025, source: "IMF" },
  { label: "Life expectancy at birth", value: "78.9 years", year: 2025, source: "World Bank" },
  { label: "Labour force participation rate", value: "62.4%", year: 2025, source: "U.S. Bureau of Labor Statistics" },
  { label: "Land area", value: "9.83 million sq km", year: 2025, source: "World Bank" },
  { label: "Current account balance", value: "−3.8% of GDP", year: 2025, source: "IMF" },
  { label: "Urban population", value: "80.2% of total", year: 2025, source: "World Bank" },
];

// One archive row per indicator per year, built from SERIES plus the
// single-year EXTRA figures (listed under their verified year).
export function archiveRows() {
  const rows = [];
  for (const key of Object.keys(SERIES)) {
    const s = SERIES[key];
    for (const y of YEARS) {
      const v = s.values[y];
      const value = key === "gdp" ? "$" + v.toFixed(1) + " trillion" : key === "population" ? v + " million" : v.toFixed(1) + "%";
      rows.push({ indicator: s.label, year: y, value, source: s.source });
    }
  }
  for (const e of EXTRA) {
    rows.push({ indicator: e.label, year: e.year, value: e.value, source: e.source });
  }
  rows.push({ indicator: "GDP per capita", year: 2025, value: "$90,027", source: "World Bank" });
  rows.push({ indicator: "Poverty rate (official)", year: 2024, value: "10.6% — 35.9 million people", source: "U.S. Census Bureau" });
  rows.push({ indicator: "Median household income", year: 2024, value: "$83,730", source: "U.S. Census Bureau" });
  return rows.sort((a, b) => b.year - a.year || a.indicator.localeCompare(b.indicator));
}

export function seriesValue(key, year) {
  return SERIES[key].values[year];
}

export function formatSeries(key, year) {
  const s = SERIES[key];
  const v = s.values[year];
  if (key === "population") return v + " million";
  if (key === "gdp") return "$" + v.toFixed(1) + " trillion";
  return v.toFixed(1) + "%";
}
