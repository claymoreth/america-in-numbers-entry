// Hand-drawn SVG charts. No chart library, no canvas, no network: every
// chart is an inline SVG string built from the verified numbers in data.js.

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function niceTicks(min, max) {
  const span = max - min || 1;
  const step = span / 4;
  const ticks = [];
  for (let i = 0; i <= 4; i++) ticks.push(min + step * i);
  return ticks;
}

// Vertical bar chart. `points` is [{label, value}], `highlight` marks one bar.
export function barChart(points, opts = {}) {
  const W = 640, H = 300, padL = 52, padB = 34, padT = 18;
  const vals = points.map((p) => p.value);
  const lo = Math.min(0, ...vals);
  const hi = Math.max(...vals);
  const span = hi - lo || 1;
  const innerW = W - padL - 16;
  const innerH = H - padT - padB;
  const y = (v) => padT + ((hi - v) / span) * innerH;
  const bw = innerW / points.length;
  const zeroY = y(0);
  let out = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.aria || "Bar chart")}" class="chart-svg">`;
  for (const t of niceTicks(lo, hi)) {
    out += `<line x1="${padL}" y1="${y(t)}" x2="${W - 16}" y2="${y(t)}" stroke="#e3ddd2" stroke-width="1"/>`;
    out += `<text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="12" fill="#5c5648">${t.toFixed(1)}</text>`;
  }
  out += `<line x1="${padL}" y1="${zeroY}" x2="${W - 16}" y2="${zeroY}" stroke="#0a2540" stroke-width="1.5"/>`;
  points.forEach((p, i) => {
    const x = padL + i * bw + bw * 0.18;
    const w = bw * 0.64;
    const top = y(Math.max(p.value, 0));
    const bottom = y(Math.min(p.value, 0));
    const fill = p.label === String(opts.highlight) ? "#1b7a3d" : "#0a2540";
    out += `<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${w.toFixed(1)}" height="${Math.max(1, bottom - top).toFixed(1)}" rx="3" fill="${fill}"/>`;
    out += `<text x="${(x + w / 2).toFixed(1)}" y="${(top - 6).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="#0a2540">${p.value.toFixed(1)}</text>`;
    out += `<text x="${(x + w / 2).toFixed(1)}" y="${H - 12}" text-anchor="middle" font-size="12" fill="#5c5648">${esc(p.label)}</text>`;
  });
  out += "</svg>";
  return out;
}

// Line chart with one or two series. `seriesList` is [{label, color, values}],
// `years` is the shared x axis.
export function lineChart(seriesList, years, opts = {}) {
  const W = 640, H = 300, padL = 52, padB = 34, padT = 18;
  const all = seriesList.flatMap((s) => s.values);
  const lo = Math.min(0, ...all);
  const hi = Math.max(...all);
  const span = hi - lo || 1;
  const innerW = W - padL - 16;
  const innerH = H - padT - padB;
  const x = (i) => padL + (i / (years.length - 1)) * innerW;
  const y = (v) => padT + ((hi - v) / span) * innerH;
  let out = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.aria || "Line chart")}" class="chart-svg">`;
  for (const t of niceTicks(lo, hi)) {
    out += `<line x1="${padL}" y1="${y(t)}" x2="${W - 16}" y2="${y(t)}" stroke="#e3ddd2" stroke-width="1"/>`;
    out += `<text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="12" fill="#5c5648">${t.toFixed(1)}</text>`;
  }
  seriesList.forEach((s) => {
    const pts = s.values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
    out += `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
    s.values.forEach((v, i) => {
      out += `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="4" fill="${s.color}"/>`;
      if (i === s.values.length - 1 || i === 0) {
        out += `<text x="${x(i).toFixed(1)}" y="${(y(v) - 10).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="${s.color}">${v.toFixed(1)}</text>`;
      }
    });
  });
  years.forEach((yr, i) => {
    out += `<text x="${x(i).toFixed(1)}" y="${H - 12}" text-anchor="middle" font-size="12" fill="#5c5648">${yr}</text>`;
  });
  out += "</svg>";
  return out;
}

// Donut showing one share of a whole, e.g. urban population 80.2%.
export function donutChart(share, label, opts = {}) {
  const pct = Math.max(0, Math.min(100, share));
  const r = 70, c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return `<svg viewBox="0 0 200 200" role="img" aria-label="${esc(label)} ${pct}% " class="donut-svg">
    <circle cx="100" cy="100" r="${r}" fill="none" stroke="#e3ddd2" stroke-width="22"/>
    <circle cx="100" cy="100" r="${r}" fill="none" stroke="#1b7a3d" stroke-width="22" stroke-dasharray="${dash.toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 100 100)" stroke-linecap="round"/>
    <text x="100" y="96" text-anchor="middle" font-size="30" font-weight="800" fill="#0a2540">${pct}%</text>
    <text x="100" y="122" text-anchor="middle" font-size="13" fill="#5c5648">${esc(label)}</text>
  </svg>`;
}

// Horizontal gauge bar for a single percentage-of-GDP style figure.
export function gaugeBar(value, max, label) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return `<div class="gauge" role="img" aria-label="${esc(label)} ${value}% of GDP">
    <div class="gauge-track"><div class="gauge-fill" style="width:${pct.toFixed(1)}%"></div></div>
    <div class="gauge-label"><span>${esc(label)}</span><strong>${value}% of GDP</strong></div>
  </div>`;
}
