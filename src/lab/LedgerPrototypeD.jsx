// Fourth ledger-column prototype: a compact working table on a cool light ground,
// with grouped column headings, tinted monograms and small bar charts. Different
// structure from the paper-ledger study. Placeholder data, not your holdings.
import React from "react";
import { SAMPLE } from "../holdings/views/LedgerPrototype.jsx";

const D = { ground: "#e9eff3", panel: "#fbfcfd", ink: "#1c2730", mute: "#667683", line: "#d6dfe5", band: "#f2f6f8", teal: "#0f6a73", tealSoft: "#d5e9ec", up: "#1f7a52", down: "#b8453b", amber: "#b27a1c" };
const sans = '"Segoe UI", system-ui, sans-serif';
const mono = '"Cascadia Mono", Consolas, monospace';
const num = { fontVariantNumeric: "tabular-nums" };
const gbp = v => `£${Math.round(Math.abs(v)).toLocaleString("en-GB")}`;
const TINTS = [["#d5e9ec", "#0f6a73"], ["#f1e4cc", "#8a5a0e"]];
const GRID = "minmax(160px,2fr) minmax(90px,1fr) 44px minmax(72px,.9fr) minmax(72px,.9fr) minmax(72px,.9fr) minmax(96px,1fr) 100px minmax(110px,1.2fr)";

function Columns({ vs }) {
  const w = 104, h = 30, lo = Math.min(...vs), hi = Math.max(...vs), r = hi - lo || 1, bw = w / vs.length;
  return (
    <svg width={w} height={h} role="img" aria-label="30-day closes, one bar per day">
      {vs.map((v, i) => { const bh = 4 + ((v - lo) / r) * (h - 6); return <rect key={i} x={i * bw + 0.5} y={h - bh} width={bw - 1.5} height={bh} fill={v >= (vs[i - 1] ?? v) ? D.teal : D.amber} opacity={i === vs.length - 1 ? 1 : 0.55} />; })}
    </svg>
  );
}

export function LedgerPrototypeDView() {
  const th = { fontSize: 10.5, fontWeight: 600, letterSpacing: 0.4, color: D.mute, textTransform: "uppercase" };
  const group = { gridColumn: "span 1", fontSize: 10, letterSpacing: 1, color: D.teal, textTransform: "uppercase", fontWeight: 700, borderBottom: `2px solid ${D.teal}`, paddingBottom: 4 };
  return (
    <section data-component="ledger-prototype-d" style={{ background: D.ground, borderRadius: 10, padding: 14, fontFamily: sans, color: D.ink, overflowX: "auto" }}>
      <div style={{ background: D.panel, border: `1px solid ${D.line}`, borderRadius: 8, padding: "14px 16px 6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Positions</h3>
          <span style={{ fontSize: 11, color: D.mute }}>Placeholder figures, design study</span>
        </div>
        <div style={{ minWidth: 800 }}>
          <div style={{ display: "grid", gridTemplateColumns: GRID, columnGap: 10, marginBottom: 6 }}>
            <span style={{ ...group, gridColumn: "1 / 4" }}>Position</span>
            <span style={{ ...group, gridColumn: "4 / 7" }}>Value</span>
            <span style={{ ...group, gridColumn: "7 / 10" }}>Shape</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: GRID, columnGap: 10, padding: "4px 0 8px", borderBottom: `1px solid ${D.line}` }}>
            <span style={th}>Holding</span><span style={th}>Sector</span><span style={{ ...th, textAlign: "right" }}>Qty</span>
            <span style={{ ...th, textAlign: "right" }}>Price</span><span style={{ ...th, textAlign: "right" }}>Value</span><span style={{ ...th, textAlign: "right" }}>P&L</span>
            <span style={th}>Weight</span><span style={th}>30D</span><span style={th}>52W range</span>
          </div>
          {SAMPLE.map((r, i) => {
            const [bg, fg] = TINTS[i];
            return (
              <div key={r.symbol} style={{ display: "grid", gridTemplateColumns: GRID, columnGap: 10, alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${D.line}`, background: i % 2 ? D.band : "transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, paddingLeft: 6 }}>
                  <span aria-hidden style={{ width: 36, height: 36, flex: "none", borderRadius: "50%", background: bg, color: fg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontSize: 11, fontWeight: 700 }}>{r.symbol.slice(0, 3)}</span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 13.5, fontWeight: 600 }}>{r.name}</span>
                    <span style={{ display: "block", fontFamily: mono, fontSize: 11, color: D.mute }}>{r.symbol} · {r.type}</span>
                  </span>
                </div>
                <div style={{ fontSize: 12.5 }}><span aria-hidden style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: fg, marginRight: 6 }} />{r.sector}<div style={{ fontSize: 11, color: D.mute, paddingLeft: 13 }}>{r.country}</div></div>
                <div style={{ textAlign: "right", fontFamily: mono, fontSize: 12.5 }}>{r.qty}</div>
                <div style={{ textAlign: "right", ...num }}><div style={{ fontFamily: mono, fontSize: 12.5 }}>${r.price.toFixed(2)}</div><div style={{ fontSize: 11, color: r.dayPct >= 0 ? D.up : D.down }}>{r.dayPct >= 0 ? "▲" : "▼"} {Math.abs(r.dayPct).toFixed(2)}%</div></div>
                <div style={{ textAlign: "right", ...num }}><div style={{ fontFamily: mono, fontSize: 12.5, fontWeight: 600 }}>{gbp(r.value)}</div><div style={{ fontSize: 11, color: D.mute }}>cost {gbp(r.value - r.pnl)}</div></div>
                <div style={{ textAlign: "right", ...num }}><div style={{ fontFamily: mono, fontSize: 12.5, color: D.up }}>+{gbp(r.pnl)}</div><div style={{ fontSize: 11, color: D.up }}>+{r.pnlPct.toFixed(1)}%</div></div>
                <div style={{ position: "relative", height: 24, background: D.tealSoft, borderRadius: 3, overflow: "hidden" }}>
                  <span aria-hidden style={{ position: "absolute", inset: 0, width: `${Math.min(100, r.weight * 3)}%`, background: D.teal }} />
                  <span style={{ position: "relative", lineHeight: "24px", paddingLeft: 8, fontFamily: mono, fontSize: 11.5, fontWeight: 600, color: "#ffffff" }}>{r.weight.toFixed(1)}%</span>
                </div>
                <div><Columns vs={r.closes} /></div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: mono, fontSize: 10.5, color: D.mute }}>
                    <span>{r.low}</span>
                    <span aria-hidden style={{ position: "relative", flex: 1, height: 2, background: D.line }}><span style={{ position: "absolute", left: `calc(${r.pos}% - 5px)`, top: -4, width: 10, height: 10, borderRadius: "50%", background: D.ink }} /></span>
                    <span>{r.high}</span>
                  </div>
                  <div style={{ fontSize: 10.5, color: D.mute, marginTop: 5, textAlign: "center" }}>{r.pos >= 95 ? "at the high" : `${(100 - r.pos).toFixed(0)}% below high`}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
