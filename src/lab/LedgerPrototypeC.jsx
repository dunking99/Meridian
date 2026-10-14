// Third ledger-column prototype: a printed-ledger feel. Warm paper, hairline rules,
// ink-dark type, one restrained green and red. No cards, fills or glow.
// Placeholder data (shared with the first prototype), not your holdings.
import React from "react";
import { SAMPLE } from "../holdings/views/LedgerPrototype.jsx";

const C = { paper: "#f7f4ec", ink: "#25231e", mute: "#7b766a", rule: "#d9d3c3", ruleSoft: "#e8e3d5", up: "#2f6b4c", down: "#a4432f", mark: "#25231e" };
const serif = 'Georgia, "Times New Roman", serif';
const sans = '"Segoe UI", system-ui, sans-serif';
const num = { fontVariantNumeric: "tabular-nums" };
const gbp = v => `£${Math.round(Math.abs(v)).toLocaleString("en-GB")}`;
const GRID = "minmax(150px,2fr) minmax(88px,1fr) 44px minmax(72px,.9fr) minmax(72px,.9fr) minmax(72px,.9fr) minmax(70px,.8fr) 90px minmax(96px,1.2fr)";

function Trend({ vs, up }) {
  const w = 96, h = 26, lo = Math.min(...vs), hi = Math.max(...vs), r = hi - lo || 1;
  const p = vs.map((v, i) => [1 + (i / (vs.length - 1)) * (w - 2), h - 2 - ((v - lo) / r) * (h - 4)]);
  return <svg width={w} height={h} role="img" aria-label="30-day price trend"><polyline points={p.map(x => x.join(",")).join(" ")} fill="none" stroke={up ? C.up : C.down} strokeWidth="1.3" /></svg>;
}

export function LedgerPrototypeCView() {
  const cellR = { textAlign: "right", ...num };
  return (
    <section data-component="ledger-prototype-c" style={{ background: C.paper, border: `1px solid ${C.rule}`, borderRadius: 4, padding: "18px 22px 8px", color: C.ink, fontFamily: sans, overflowX: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontFamily: serif, fontWeight: 400, fontSize: 21, letterSpacing: 0.2 }}>Holdings</h3>
        <span style={{ fontSize: 11, color: C.mute, fontStyle: "italic" }}>Placeholder figures, design study</span>
      </div>
      <div style={{ minWidth: 780 }}>
        <div style={{ display: "grid", gridTemplateColumns: GRID, gap: 10, borderTop: `2px solid ${C.ink}`, borderBottom: `1px solid ${C.rule}`, padding: "7px 0", fontSize: 10.5, letterSpacing: 1.1, textTransform: "uppercase", color: C.mute }}>
          <span>Holding</span><span>Sector</span><span style={{ textAlign: "right" }}>Qty</span><span style={{ textAlign: "right" }}>Price</span><span style={{ textAlign: "right" }}>Value</span><span style={{ textAlign: "right" }}>Gain</span><span>Weight</span><span>30 days</span><span>52 weeks</span>
        </div>
        {SAMPLE.map(r => {
          const up30 = r.closes.at(-1) >= r.closes[0];
          return (
            <div key={r.symbol} style={{ display: "grid", gridTemplateColumns: GRID, gap: 10, alignItems: "center", padding: "13px 0", borderBottom: `1px solid ${C.ruleSoft}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
                <span aria-hidden style={{ width: 34, height: 34, flex: "none", border: `1px solid ${C.ink}`, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 15, fontWeight: 700 }}>{r.symbol[0]}</span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontWeight: 600, fontSize: 13.5, letterSpacing: 0.3 }}>{r.symbol}</span>
                  <span style={{ display: "block", fontSize: 11.5, color: C.mute, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
                </span>
              </div>
              <div><div style={{ fontSize: 12.5 }}>{r.sector}</div><div style={{ fontSize: 11, color: C.mute }}>{r.country}</div></div>
              <div style={cellR}><div style={{ fontSize: 13 }}>{r.qty}</div><div style={{ fontSize: 11, color: C.mute }}>at {r.avgCost}</div></div>
              <div style={cellR}><div style={{ fontSize: 13 }}>${r.price.toFixed(2)}</div><div style={{ fontSize: 11, color: r.dayPct >= 0 ? C.up : C.down }}>{r.dayPct >= 0 ? "+" : "−"}{Math.abs(r.dayPct).toFixed(2)}%</div></div>
              <div style={cellR}><div style={{ fontSize: 13, fontWeight: 600 }}>{gbp(r.value)}</div><div style={{ fontSize: 11, color: r.dayGbp >= 0 ? C.up : C.down }}>{r.dayGbp >= 0 ? "+" : "−"}{gbp(r.dayGbp)}</div></div>
              <div style={cellR}><div style={{ fontSize: 13, color: C.up }}>+{gbp(r.pnl)}</div><div style={{ fontSize: 11, color: C.up }}>+{r.pnlPct.toFixed(1)}%</div></div>
              <div>
                <div style={{ fontSize: 13, ...num }}>{r.weight.toFixed(1)}%</div>
                <div aria-hidden style={{ height: 3, background: C.ruleSoft, marginTop: 6 }}><div style={{ width: `${Math.min(100, r.weight * 3)}%`, height: 3, background: C.ink }} /></div>
              </div>
              <div><Trend vs={r.closes} up={up30} /></div>
              <div>
                <div aria-hidden style={{ position: "relative", height: 1, background: C.mute, margin: "9px 0 8px" }}>
                  <span style={{ position: "absolute", left: 0, top: -4, width: 1, height: 9, background: C.mute }} />
                  <span style={{ position: "absolute", right: 0, top: -4, width: 1, height: 9, background: C.mute }} />
                  <span style={{ position: "absolute", left: `calc(${r.pos}% - 4px)`, top: -4, width: 9, height: 9, borderRadius: "50%", background: C.mark }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: C.mute, ...num }}><span>{r.low}</span><span>{r.high}</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
