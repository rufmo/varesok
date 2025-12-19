const CSV_URL = "varer.csv";
const MAX_RESULTS = 50;

const loadStatusEl = document.getElementById("loadStatus");
const qEl = document.getElementById("q");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");

let ITEMS = [];

function norm(v) {
  return String(v ?? "").trim();
}

function uniq(arr) {
  const seen = new Set();
  const out = [];
  for (const x of arr.map(norm)) {
    if (!x) continue;
    if (seen.has(x)) continue;
    seen.add(x);
    out.push(x);
  }
  return out;
}

function buildIndexFromText(text) {
  const clean = text.replace(/^\uFEFF/, "");
  const lines = clean.split(/\r?\n/).filter(l => l.trim().length > 0);

  const headers = lines[0].split(";").map(h => h.trim());
  const idxSK = headers.indexOf("SK-no");
  const idxDesc = headers.indexOf("Description");

  const vendorIdxs = headers
    .map((h, i) => (/^vendor/i.test(h) ? i : -1))
    .filter(i => i >= 0);

  const items = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(";");
    const internalNo = norm(parts[idxSK]);
    const name = norm(parts[idxDesc]);
    const supplierNos = uniq(vendorIdxs.map(ix => parts[ix]));

    if (!internalNo && !name && supplierNos.length === 0) continue;

    const searchable = `${name} ${internalNo} ${supplierNos.join(" ")}`.toLowerCase();
    items.push({ name, internalNo, supplierNos, searchable });
  }

  return items;
}

function scoreItem(tokens, item) {
  const q = tokens.join(" ").toLowerCase();
  let score = 0;

  if (item.internalNo.toLowerCase() === q) score += 220;
  for (const s of item.supplierNos) {
    if (s.toLowerCase() === q) score += 200;
  }

  if (q.length >= 3) {
    if (item.internalNo.toLowerCase().includes(q)) score += 60;
    for (const s of item.supplierNos) {
      if (s.toLowerCase().includes(q)) score += 50;
    }
  }

  for (const t of tokens) {
    if (item.searchable.includes(t)) score += 6;
  }

  return score;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function highlight(text, tokens) {
  let out = String(text);
  for (const t of tokens.filter(x => x.length >= 2)) {
    const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
    out = out.replace(re, "<mark>$1</mark>");
  }
  return out;
}

function renderResults(results, tokens) {
  resultsEl.innerHTML = results.map(it => `
    <div class="item">
      <div class="title">${highlight(escapeHtml(it.name || "(uten beskrivelse)"), tokens)}</div>
      <div class="sub">Internt varenr: <strong>${highlight(escapeHtml(it.internalNo), tokens)}</strong></div>
      <div class="sub">Leverandørvarenr: ${highlight(escapeHtml(it.supplierNos.join(", ")), tokens)}</div>
    </div>
  `).join("");
}

function doSearch(q) {
  const tokens = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) {
    statusEl.textContent = "";
    resultsEl.innerHTML = "";
    return;
  }

  const scored = ITEMS
    .map(it => ({ ...it, _score: scoreItem(tokens, it) }))
    .filter(it => it._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, MAX_RESULTS);

  statusEl.textContent = `${scored.length} treff`;
  renderResults(scored, tokens);
}

async function init() {
  loadStatusEl.textContent = "Laster CSV…";
  try {
    const res = await fetch(CSV_URL, { cache: "no-store" });
    const text = await res.text();
    ITEMS = buildIndexFromText(text);
    loadStatusEl.textContent = `Lastet ${ITEMS.length} varer`;
  } catch (e) {
    loadStatusEl.textContent = "Feil ved lasting av CSV";
  }
}

let timer;
qEl.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(() => doSearch(qEl.value), 150);
});

init();
