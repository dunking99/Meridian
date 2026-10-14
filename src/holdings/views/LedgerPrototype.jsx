// Prototype of the redesigned ledger columns. Placeholder rows only: the figures
// below are invented to show each design at its best and are labelled as such on
// the page. Nothing here reads your holdings.
import React from "react";
import { useT, FONT, cat } from "../../shared/theme.jsx";
import { Frame } from "../../shared/ui.jsx";

export const SAMPLE = [
  { symbol: "ASML", name: "ASML Holding N.V.", type: "Equity", sector: "Technology", country: "Netherlands", qty: 5, avgCost: 720, price: 1765.95, dayPct: -0.81, dayGbp: -72, value: 6676, pnl: 3950, pnlPct: 145.3, weight: 17.5,
    closes: [62, 64, 63, 66, 65, 68, 67, 70, 69, 72, 71, 68, 66, 69, 73, 75, 74, 77, 76, 79, 78, 81], low: 930, high: 1987, pos: 79 },
  { symbol: "AAPL", name: "Apple Inc.", type: "Equity", sector: "Technology", country: "United States", qty: 20, avgCost: 185, price: 340.85, dayPct: 1.25, dayGbp: 61, value: 5154, pnl: 2360, pnlPct: 84.5, weight: 13.5,
    closes: [70, 69, 71, 70, 72, 71, 69, 68, 70, 72, 74, 73, 75, 76, 75, 77, 76, 78, 77, 79, 78, 80], low: 244, high: 341, pos: 99 },
];

const gbp = v => `£${Math.round(Math.abs(v)).toLocaleString("en-GB")}`;
const signed = (v, f) => `${v >= 0 ? "+" : "−"}${f(v)}`;
const GRID = "minmax(200px,2.2fr) minmax(110px,1.1fr) minmax(70px,0.7fr) minmax(90px,0.9fr) minmax(90px,0.9fr) minmax(100px,1fr) minmax(110px,1.1fr) minmax(120px,1.2fr) minmax(150px,1.5fr)";
const HEAD = ["Holding", "Sector", "Qty", "Price", "Value", "P&L", "Weight", "30D", "52W"];

function Sparkline30({ vs, up }) {
  const t = useT();
  const w = 108, h = 32, lo = Math.min(...vs), hi = Math.max(...vs), r = hi - lo || 1;
  const p = vs.map((v, i) => [2 + (i / (vs.length - 1)) * (w - 4), h - 3 - ((v - lo) / r) * (h - 6)]);
  const d = p.map(x => x.join(",")).join(" ");
  const c = up ? t.positive : t.negative;
  const iHi = vs.indexOf(hi), iLo = vs.indexOf(lo);
  return (
    <svg width={w} height={h} role="img" aria-label="30-day price trend with its high and low marked">
      <polygon points={`${p[0][0]},${h} ${d} ${p.at(-1)[0]},${h}`} fill={c} opacity="0.14" />
      <polyline points={d} fill="none" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx={p[iHi][0]} cy={p[iHi][1]} r="2.5" fill={t.positive} />
      <circle cx={p[iLo][0]} cy={p[iLo][1]} r="2.5" fill={t.negative} />
    </svg>
  );
}

export function LedgerPrototypeView() {
  const t = useT();
  const mono = { fontFamily: FONT.mono, fontVariantNumeric: "tabular-nums" };
  const sub = { fontSize: 10.5, color: t.textMuted, marginTop: 2 };
  const cell = { padding: "12px 8px", minWidth: 0 };
  return (
    <Frame id="ledger-prototype" title="Ledger Columns, Prototype" right={<span style={{ fontSize: 11, color: t.textMuted }}>Placeholder data, not your holdings</span>}>
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 1000 }}>
          <div role="row" style={{ display: "grid", gridTemplateColumns: GRID, borderBottom: `1px solid ${t.borderStrong}` }}>
            {HEAD.map((h, i) => <div key={h} role="columnheader" style={{ ...cell, padding: "8px", fontFamily: FONT.mono, fontSize: 9.5, letterSpacing: 1.2, textTransform: "uppercase", color: t.textMuted, textAlign: i >= 2 && i <= 5 ? "right" : "left" }}>{h}</div>)}
          </div>
          {SAMPLE.map((r, i) => (
            <div key={r.symbol} role="row" style={{ display: "grid", gridTemplateColumns: GRID, alignItems: "center", borderBottom: `1px solid ${t.borderSubtle}` }}>
              <div style={{ ...cell, display: "flex", alignItems: "center", gap: 10 }}>
                <span aria-hidden style={{ width: 36, height: 36, borderRadius: 9, background: cat(t, i), color: t.surface, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.mono, fontWeight: 700, fontSize: 11, flex: "none" }}>{r.symbol.slice(0, 3)}</span>
                <span style={{ minWidth: 0 }}>
                  <span><b style={{ fontFamily: FONT.mono, fontSize: 13 }}>{r.symbol}</b> <span style={{ fontSize: 9.5, color: t.textMuted, border: `1px solid ${t.border}`, borderRadius: 3, padding: "0 4px" }}>{r.type}</span></span>
                  <span style={{ display: "block", ...sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
                </span>
              </div>
              <div style={cell}><div style={{ fontSize: 12.5 }}>{r.sector}</div><div style={sub}>{r.country}</div></div>
              <div style={{ ...cell, textAlign: "right", ...mono }}><div style={{ fontSize: 12.5 }}>{r.qty}</div><div style={sub}>@ {r.avgCost}</div></div>
              <div style={{ ...cell, textAlign: "right", ...mono }}><div style={{ fontSize: 12.5 }}>${r.price.toFixed(2)}</div><div style={{ ...sub, color: r.dayPct >= 0 ? t.positive : t.negative }}>{signed(r.dayPct, v => `${Math.abs(v).toFixed(2)}%`)}</div></div>
              <div style={{ ...cell, textAlign: "right", ...mono }}><div style={{ fontSize: 12.5 }}>{gbp(r.value)}</div><div style={{ ...sub, color: r.dayGbp >= 0 ? t.positive : t.negative }}>{signed(r.dayGbp, gbp)} today</div></div>
              <div style={{ ...cell, textAlign: "right", ...mono }}><div style={{ fontSize: 12.5, color: t.positive }}>{signed(r.pnl, gbp)}</div><div style={{ ...sub, color: t.positive }}>{signed(r.pnlPct, v => `${v.toFixed(1)}%`)}</div></div>
              <div style={cell}>
                <div style={{ ...mono, fontSize: 13 }}>{r.weight.toFixed(1)}%</div>
                <div aria-hidden style={{ height: 5, borderRadius: 3, background: t.surfaceInset, marginTop: 5, position: "relative", overflow: "hidden" }}><span style={{ position: "absolute", inset: 0, width: `${Math.min(100, r.weight * 2.4)}%`, background: t.info, borderRadius: 3 }} /></div>
              </div>
              <div style={cell}><Sparkline30 vs={r.closes} up={r.closes.at(-1) >= r.closes[0]} /></div>
              <div style={cell}>
                <div aria-hidden style={{ position: "relative", height: 9, borderRadius: 5, background: `linear-gradient(90deg, ${t.negative}, ${t.surfaceInset}, ${t.positive})` }}>
                  <span style={{ position: "absolute", top: -3, left: `calc(${r.pos}% - 2px)`, width: 4, height: 15, borderRadius: 2, background: t.text }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", ...mono, fontSize: 9.5, color: t.textMuted, marginTop: 6 }}><span>${r.low}</span><span>${r.high}</span></div>
                <div style={{ fontSize: 10, color: t.textMuted, ...mono }}>{(100 - r.pos).toFixed(0)}% below the high</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}
