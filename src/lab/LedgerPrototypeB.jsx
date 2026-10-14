// Second ledger-column prototype, drawn without reference to Meridian's own look:
// floating row cards, oversized numerals, pills, rings and glow. Placeholder data
// (shared with the first prototype), not your holdings.
import React from "react";
import { SAMPLE } from "../holdings/views/LedgerPrototype.jsx";
import { P, TILES } from "./palette.js";

const font = '"Inter", "Segoe UI", system-ui, sans-serif';
const num = { fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" };
const gbp = v => `£${Math.round(Math.abs(v)).toLocaleString("en-GB")}`;
const GRID = "minmax(210px,2.1fr) minmax(130px,1.2fr) minmax(80px,0.7fr) minmax(120px,1fr) minmax(110px,1fr) minmax(120px,1fr) 90px minmax(130px,1.1fr) minmax(170px,1.5fr)";

function Pill({ children, colour, solid }) {
  return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 600, background: solid ? colour : `${colour}22`, color: solid ? P.bg : colour, whiteSpace: "nowrap" }}>{children}</span>;
}

function Curve({ vs, colour, id }) {
  const w = 130, h = 44, lo = Math.min(...vs), hi = Math.max(...vs), r = hi - lo || 1;
  const p = vs.map((v, i) => [4 + (i / (vs.length - 1)) * (w - 8), h - 6 - ((v - lo) / r) * (h - 12)]);
  const d = p.reduce((a, pt, i, arr) => {
    if (!i) return `M${pt[0]},${pt[1]}`;
    const p0 = arr[i - 2] ?? arr[i - 1], p1 = arr[i - 1], p2 = pt, p3 = arr[i + 1] ?? pt;
    return `${a} C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }, "");
  const end = p.at(-1);
  return (
    <svg width={w} height={h} role="img" aria-label="30-day trend" style={{ overflow: "visible" }}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={colour} stopOpacity=".38" /><stop offset="1" stopColor={colour} stopOpacity="0" /></linearGradient></defs>
      <path d={`${d} L${end[0]},${h} L${p[0][0]},${h} Z`} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={colour} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx={end[0]} cy={end[1]} r="7" fill={colour} opacity=".25" />
      <circle cx={end[0]} cy={end[1]} r="3.4" fill={colour} />
    </svg>
  );
}

function Ring({ pct, max = 25, colour }) {
  const c = 2 * Math.PI * 19, f = Math.min(1, pct / max) * c;
  return (
    <div style={{ position: "relative", width: 56, height: 56 }}>
      <svg width="56" height="56"><circle cx="28" cy="28" r="19" fill="none" stroke={P.line} strokeWidth="7" /><circle cx="28" cy="28" r="19" fill="none" stroke={colour} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${f} ${c}`} transform="rotate(-90 28 28)" /></svg>
      <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: P.text, ...num }}>{pct.toFixed(1)}</span>
    </div>
  );
}

function Range52({ r }) {
  const stops = [P.coral, P.amber, P.sky, P.mint];
  return (
    <div>
      <div style={{ position: "relative", height: 8, borderRadius: 4, background: `linear-gradient(90deg, ${stops.join(",")})`, opacity: 0.9 }}>
        <span style={{ position: "absolute", top: -6, left: `calc(${r.pos}% - 10px)`, width: 20, height: 20, borderRadius: "50%", background: P.text, border: `4px solid ${P.bg}`, boxShadow: `0 0 0 2px ${P.violet}` }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11, color: P.mute, ...num }}><span>${r.low}</span><span style={{ color: P.text, fontWeight: 600 }}>{r.pos}th pct</span><span>${r.high}</span></div>
    </div>
  );
}

export function LedgerPrototypeBView() {
  const head = { fontSize: 11, fontWeight: 600, color: P.faint, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 14px" };
  return (
    <section data-component="ledger-prototype-b" style={{ background: P.bg, borderRadius: 18, padding: "22px 20px 24px", fontFamily: font, color: P.text, overflowX: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>Your positions</h3>
        <span style={{ fontSize: 12, color: P.faint }}>Placeholder data, a design exploration with its own look</span>
      </div>
      <div style={{ minWidth: 1080 }}>
        <div style={{ display: "grid", gridTemplateColumns: GRID, marginBottom: 8 }}>
          {["Holding", "Sector", "Qty", "Price", "Value", "P&L", "Weight", "30 days", "52 weeks"].map(h => <div key={h} style={head}>{h}</div>)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SAMPLE.map((r, i) => {
            const [a, b] = TILES[i];
            const up30 = r.closes.at(-1) >= r.closes[0];
            return (
              <div key={r.symbol} style={{ display: "grid", gridTemplateColumns: GRID, alignItems: "center", background: P.card, borderRadius: 16, padding: "16px 0", border: `1px solid ${P.line}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 14px" }}>
                  <span aria-hidden style={{ width: 46, height: 46, borderRadius: 14, background: `linear-gradient(135deg, ${a}, ${b})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: P.bg, flex: "none" }}>{r.symbol.slice(0, 2)}</span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" }}>{r.symbol}</span>
                    <span style={{ display: "block", fontSize: 12, color: P.mute, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
                  </span>
                </div>
                <div style={{ padding: "0 14px", display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}><Pill colour={P.violet}>{r.sector}</Pill><span style={{ fontSize: 11.5, color: P.mute }}>{r.country}</span></div>
                <div style={{ padding: "0 14px", ...num }}><div style={{ fontSize: 16, fontWeight: 700 }}>{r.qty}</div><div style={{ fontSize: 11.5, color: P.mute }}>avg {r.avgCost}</div></div>
                <div style={{ padding: "0 14px", ...num }}><div style={{ fontSize: 17, fontWeight: 700 }}>${r.price.toFixed(2)}</div><div style={{ marginTop: 4 }}><Pill colour={r.dayPct >= 0 ? P.mint : P.coral}>{r.dayPct >= 0 ? "▲" : "▼"} {Math.abs(r.dayPct).toFixed(2)}%</Pill></div></div>
                <div style={{ padding: "0 14px", ...num }}><div style={{ fontSize: 20, fontWeight: 800 }}>{gbp(r.value)}</div><div style={{ fontSize: 12, color: r.dayGbp >= 0 ? P.mint : P.coral }}>{r.dayGbp >= 0 ? "+" : "−"}{gbp(r.dayGbp)} today</div></div>
                <div style={{ padding: "0 14px", ...num }}><div style={{ fontSize: 17, fontWeight: 800, color: P.mint }}>+{gbp(r.pnl)}</div><div style={{ marginTop: 4 }}><Pill colour={P.mint} solid>+{r.pnlPct.toFixed(1)}%</Pill></div></div>
                <div style={{ padding: "0 14px" }}><Ring pct={r.weight} colour={[P.violet, P.sky][i]} /></div>
                <div style={{ padding: "0 14px" }}><Curve vs={r.closes} colour={up30 ? P.mint : P.coral} id={`b-curve-${i}`} /></div>
                <div style={{ padding: "0 22px 0 14px" }}><Range52 r={r} /></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
