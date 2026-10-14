// Fixed-width copy of the fifth ledger-column prototype, kept exactly as it was
// before the draggable column borders were added (so it can be compared with the
// draggable one above it). Placeholder data, not your holdings.
import React from "react";
import { SAMPLE } from "../holdings/views/LedgerPrototype.jsx";

const E = { ground: "#e9eff3", panel: "#fbfcfd", ink: "#1c2730", mute: "#627280", line: "#d6dfe5", band: "#f1f5f8", teal: "#0f6a73", tealSoft: "#d5e9ec", up: "#1f7a52", down: "#c0463f", upSoft: "#d9f2e6", downSoft: "#f8e1de", mint: "#2fcf9a", mintInk: "#0b3d2c", warm: "#f3efe4", neutral: "#e7ebee" };
const sans = '"Segoe UI", system-ui, sans-serif';
const mono = '"Cascadia Mono", Consolas, monospace';
const num = { fontVariantNumeric: "tabular-nums" };
const gbp = v => `£${Math.round(Math.abs(v)).toLocaleString("en-GB")}`;
const TINTS = [["#d5e9ec", "#0f6a73"], ["#f1e4cc", "#8a5a0e"]];
const GRID = "minmax(230px,440px) 52px 88px 108px 112px 112px minmax(150px,240px) minmax(130px,280px) minmax(170px,1fr)";

// One bar per day, rising from the bottom: bar height is the close, colour is
// whether that day closed up (green) or down (red) on the day before. The latest
// day is drawn solid.
function DailyBars({ vs }) {
  const h = 38, lo = Math.min(...vs), hi = Math.max(...vs), r = hi - lo || 1, n = vs.length;
  return (
    <svg role="img" aria-label="Last 30 closes, one bar per day; green closed up on the day, red closed down" width="100%" height={h} viewBox={`0 0 ${n * 4} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
      {vs.map((v, i) => {
        const bh = 5 + ((v - lo) / r) * (h - 7);
        return <rect key={i} x={i * 4 + 0.4} width="3.1" y={h - bh} height={bh} fill={v >= (vs[i - 1] ?? v) ? E.up : E.down} opacity={i === n - 1 ? 1 : 0.6} />;
      })}
    </svg>
  );
}

function Pill({ children, bg, fg }) {
  return <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, background: bg, color: fg, whiteSpace: "nowrap", ...num }}>{children}</span>;
}

export function LedgerPrototypeFView() {
  const th = { fontSize: 11, fontWeight: 600, letterSpacing: 0.5, color: E.mute, textTransform: "uppercase" };
  const big = { fontSize: 16, fontWeight: 600, letterSpacing: -0.1, lineHeight: 1.25, ...num };
  const right = { display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right", paddingRight: 4, ...num };
  return (
    <section data-component="ledger-prototype-f" style={{ background: E.ground, borderRadius: 10, padding: 14, fontFamily: sans, color: E.ink, overflowX: "auto" }}>
      <div style={{ background: E.panel, border: `1px solid ${E.line}`, borderRadius: 8, padding: "14px 16px 6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Positions</h3>
          <span style={{ fontSize: 11.5, color: E.mute }}>Placeholder figures, design study · fixed widths (before resizable columns)</span>
        </div>
        <div style={{ minWidth: 760 }}>
          <div style={{ display: "grid", gridTemplateColumns: GRID, columnGap: 10, padding: "4px 0 8px", borderBottom: `1px solid ${E.line}` }}>
            <span style={{ ...th, paddingLeft: 6 }}>Holding</span><span style={{ ...th, textAlign: "right", paddingRight: 4 }}>Qty</span><span style={{ ...th, textAlign: "right", paddingRight: 4 }}>Avg Cost</span>
            <span style={{ ...th, textAlign: "right", paddingRight: 13 }}>Price</span><span style={{ ...th, textAlign: "right", paddingRight: 13 }}>Value</span><span style={{ ...th, textAlign: "right", paddingRight: 13 }}>P&L</span>
            <span style={{ ...th, paddingLeft: 28 }}>Weight</span><span style={th}>30D</span><span style={th}>52W</span>
          </div>
          {SAMPLE.map((r, i) => {
            const [bg, fg] = TINTS[i];
            const dayUp = r.dayPct >= 0;
            return (
              <div key={r.symbol} style={{ display: "grid", gridTemplateColumns: GRID, columnGap: 10, alignItems: "center", padding: "13px 0", borderBottom: `1px solid ${E.line}`, background: i % 2 ? E.band : "transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0, paddingLeft: 6 }}>
                  <span aria-hidden style={{ width: 40, height: 40, flex: "none", borderRadius: "50%", background: bg, color: fg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontSize: 12, fontWeight: 700 }}>{r.symbol.slice(0, 3)}</span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 15.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
                    <span style={{ display: "block", fontFamily: mono, fontSize: 12, color: E.mute }}>{r.symbol} · {r.type} · {r.sector}</span>
                  </span>
                </div>
                <div style={{ ...right, ...big }}>{r.qty}</div>
                <div style={{ ...right, ...big }}>${r.avgCost}</div>
                <div style={right}><div style={{ ...big, paddingRight: 9 }}>${r.price.toFixed(2)}</div><div style={{ marginTop: 4 }}><Pill bg={dayUp ? E.upSoft : E.downSoft} fg={dayUp ? E.up : E.down}>{dayUp ? "▲" : "▼"} {Math.abs(r.dayPct).toFixed(2)}%</Pill></div></div>
                <div style={right}><div style={{ ...big, paddingRight: 9 }}>{gbp(r.value)}</div><div style={{ marginTop: 4 }}><Pill bg={r.dayGbp >= 0 ? E.upSoft : E.downSoft} fg={r.dayGbp >= 0 ? E.up : E.down}>{r.dayGbp >= 0 ? "▲" : "▼"} {gbp(r.dayGbp)} today</Pill></div></div>
                <div style={right}><div style={{ ...big, paddingRight: 9 }}>{r.pnl >= 0 ? "+" : "−"}{gbp(r.pnl)}</div><div style={{ marginTop: 4 }}><Pill bg={r.pnl >= 0 ? E.upSoft : E.downSoft} fg={r.pnl >= 0 ? E.up : E.down}>{r.pnl >= 0 ? "▲" : "▼"} {Math.abs(r.pnlPct).toFixed(1)}%</Pill></div></div>
                <div style={{ paddingLeft: 28 }}>
                  <div style={big}>{r.weight.toFixed(1)}%</div>
                  <div aria-hidden style={{ height: 5, borderRadius: 3, background: E.tealSoft, marginTop: 6, maxWidth: 130, overflow: "hidden" }}><div style={{ width: `${Math.min(100, r.weight * 3)}%`, height: 5, background: E.teal, borderRadius: 3 }} /></div>
                </div>
                <div style={{ padding: "0 4px" }}><DailyBars vs={r.closes} /></div>
                <div style={{ paddingRight: 18 }}>
                  <div aria-hidden style={{ position: "relative", height: 8, borderRadius: 4, background: `linear-gradient(90deg, ${E.down}, ${E.neutral} 50%, ${E.up})` }}>
                    <span style={{ position: "absolute", top: -5, left: `calc(${r.pos}% - 3px)`, width: 6, height: 18, borderRadius: 3, background: E.ink, border: `2px solid ${E.panel}`, boxSizing: "content-box", marginLeft: -2 }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 9, ...num }}>
                    <span><span style={{ display: "block", fontSize: 10.5, letterSpacing: 0.6, textTransform: "uppercase", color: E.mute }}>52W low</span><span style={{ fontSize: 13.5, fontWeight: 600 }}>${r.low.toLocaleString("en-US")}</span></span>
                    <span style={{ fontSize: 12, color: E.mute, paddingBottom: 1 }}>{r.pos >= 98 ? "at the high" : `${(100 - r.pos).toFixed(0)}% below high`}</span>
                    <span style={{ textAlign: "right" }}><span style={{ display: "block", fontSize: 10.5, letterSpacing: 0.6, textTransform: "uppercase", color: E.mute }}>52W high</span><span style={{ fontSize: 13.5, fontWeight: 600 }}>${r.high.toLocaleString("en-US")}</span></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
