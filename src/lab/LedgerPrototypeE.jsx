// Fifth ledger-column prototype: the pieces picked from the earlier studies.
// Teal weight bar with the number inside, tinted round monogram with name over
// "TICKER · Type", day-change and gain pills, a filled 30-day area with the low
// and latest points marked, and the dot-on-a-line 52-week range with prices at
// the ends. Figures sit between the earlier "too small" and "too big" sizes.
// Placeholder data, not your holdings.
import React, { useEffect, useRef, useState } from "react";
import { SAMPLE } from "../holdings/views/LedgerPrototype.jsx";

const E = { ground: "#e9eff3", panel: "#fbfcfd", ink: "#1c2730", mute: "#627280", line: "#d6dfe5", band: "#f1f5f8", teal: "#0f6a73", tealSoft: "#d5e9ec", up: "#1f7a52", down: "#c0463f", upSoft: "#d9f2e6", downSoft: "#f8e1de", mint: "#2fcf9a", mintInk: "#0b3d2c", warm: "#f3efe4", neutral: "#e7ebee" };
const sans = '"Segoe UI", system-ui, sans-serif';
const mono = '"Cascadia Mono", Consolas, monospace';
const num = { fontVariantNumeric: "tabular-nums" };
const gbp = v => `£${Math.round(Math.abs(v)).toLocaleString("en-GB")}`;
const TINTS = [["#d5e9ec", "#0f6a73"], ["#f1e4cc", "#8a5a0e"]];
// Column widths in px, draggable from the header borders and remembered per browser.
// Every column, 52W included, has its own width; the points boxes can add up to more or less than 100.
const COLS = ["Holding", "Qty", "Avg Cost", "Price", "Value", "P&L", "Weight", "30D", "52W"];
const DEFAULT_W = [330, 56, 92, 116, 124, 118, 176, 176, 200];
const MIN_W = 12, STORE = "meridian.lab.ledgerE.widths";
const loadW = () => { try { const v = JSON.parse(localStorage.getItem(STORE)); return Array.isArray(v) && v.length === DEFAULT_W.length ? v : DEFAULT_W; } catch { return DEFAULT_W; } };

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

export function LedgerPrototypeEView() {
  const [w, setW] = useState(loadW);
  const live = useRef(w);
  const boxRef = useRef(null);
  const [gw, setGw] = useState(0);              // full table width in px = 100 points
  const [active, setActive] = useState(null);   // column being dragged
  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const measure = () => setGw(el.clientWidth - 32);   // panel minus its 16px side padding
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // Each column's share counts its width plus the 10px gap after it. 100 = the box width; typing a column only changes that column.
  const pts = w.map(x => (gw ? ((x + 10) / gw) * 100 : 0));
  const total = pts.reduce((a, b) => a + b, 0);
  const [hist, setHist] = useState([]);   // previous width sets, most recent last
  const template = w.map(x => `${x}px`).join(" ");
  const save = v => { try { localStorage.setItem(STORE, JSON.stringify(v)); } catch { /* storage blocked: widths just reset next visit */ } };
  const commit = (next, before) => { live.current = next; setW(next); if (JSON.stringify(next) !== JSON.stringify(before)) setHist(h => [...h, before]); save(next); };
  // Move column i's right-hand border by d px: column i and the one to its right trade the space,
  // so the total stays put. The last column (52W) has no neighbour and just grows or shrinks.
  const shifted = (base, i, d) => {
    const next = [...base];
    const hasPartner = i < base.length - 1;
    const lo = -(base[i] - MIN_W), hi = hasPartner ? base[i + 1] - MIN_W : Infinity;
    const dd = Math.min(hi, Math.max(lo, d));
    next[i] = base[i] + dd;
    if (hasPartner) next[i + 1] = base[i + 1] - dd;
    return next;
  };
  const startDrag = (i, e) => {
    e.preventDefault();
    setActive(i);
    const x0 = e.clientX, base = live.current;
    const move = ev => { const next = shifted(base, i, ev.clientX - x0); live.current = next; setW(next); };
    const up = () => { setActive(null); window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); commit(live.current, base); };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
  };
  // Type an exact width in points: only that column changes, so the total may pass 100 (the table then runs wider than the box).
  const setPoints = (i, P) => {
    if (!gw || !(P > 0)) return;
    const base = live.current, next = [...base];
    next[i] = Math.max(MIN_W, (P / 100) * gw - 10);
    commit(next, base);
  };
  const [draft, setDraft] = useState(null);   // { i, text } while a points box is being typed in
  const undo = () => { const last = hist.at(-1); if (!last) return; setHist(h => h.slice(0, -1)); live.current = last; setW(last); save(last); };
  const resetW = () => { if (JSON.stringify(live.current) !== JSON.stringify(DEFAULT_W)) setHist(h => [...h, live.current]); live.current = DEFAULT_W; setW(DEFAULT_W); try { localStorage.removeItem(STORE); } catch { /* ignore */ } };
  const th = { fontSize: 11, fontWeight: 600, letterSpacing: 0.5, color: E.mute, textTransform: "uppercase", userSelect: "none" };
  const big = { fontSize: 16, fontWeight: 600, letterSpacing: -0.1, lineHeight: 1.25, ...num };
  const sub = { fontSize: 12.5, color: E.mute, ...num };
  const right = { display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right", paddingRight: 4, ...num };
  return (
    <section data-component="ledger-prototype-e" style={{ background: E.ground, borderRadius: 10, padding: 14, fontFamily: sans, color: E.ink, overflowX: "auto" }}>
      <div ref={boxRef} style={{ background: E.panel, border: `1px solid ${E.line}`, borderRadius: 8, padding: "14px 16px 6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Positions</h3>
          <span style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11.5, color: E.mute }}>
            Placeholder figures, design study · type or drag; each box is that column's width in points (100 = full width)
            {gw > 0 && <span style={{ fontFamily: mono, fontWeight: 600, color: total > 100.0001 ? E.down : E.mute }}>Total {total.toFixed(4)}{total > 100.0001 ? ` · ${(total - 100).toFixed(4)} over: wider than the box, scroll sideways` : total < 99.9999 ? ` · ${(100 - total).toFixed(4)} spare` : ""}</span>}
            <button onClick={undo} disabled={!hist.length} title={hist.length ? "Undo the last column resize" : "Nothing to undo"} style={{ fontFamily: sans, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 6, border: `1px solid ${E.line}`, background: E.panel, color: hist.length ? E.ink : E.mute, opacity: hist.length ? 1 : 0.55, cursor: hist.length ? "pointer" : "default" }}>↶ Undo</button>
          </span>
        </div>
        <div style={{ width: w.reduce((a, b) => a + b, 0) + 10 * (w.length - 1) }}>
          <div aria-label="Column widths in points, where 100 is the full table width" style={{ display: "grid", gridTemplateColumns: template, columnGap: 10, marginBottom: 6 }}>
            {pts.map((p, i) => {
              const editing = draft?.i === i;
              const on = editing || active === i;
              return (
                <input key={i} aria-label={`${COLS[i]} column width in points`} inputMode="decimal"
                  value={editing ? draft.text : p.toFixed(4)}
                  onFocus={e => { setDraft({ i, text: p.toFixed(4) }); e.target.select(); }}
                  onChange={e => setDraft({ i, text: e.target.value })}
                  onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); if (e.key === "Escape") { setDraft(null); e.currentTarget.blur(); } }}
                  onBlur={() => { if (draft?.i === i) { const v = parseFloat(draft.text); setDraft(null); if (Number.isFinite(v) && Math.abs(v - p) > 1e-9) setPoints(i, v); } }}
                  style={{ justifySelf: "start", position: "relative", zIndex: editing ? 3 : 1, width: editing ? 78 : "100%", maxWidth: 78, minWidth: 0, boxSizing: "border-box", fontFamily: mono, fontSize: 10.5, fontWeight: 600, padding: "2px 3px", textAlign: "center", borderRadius: 4, border: `1px solid ${on ? E.teal : "transparent"}`, outline: "none", background: on ? E.panel : E.tealSoft, color: E.teal, ...num }} />
              );
            })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: template, columnGap: 10, padding: "4px 0 8px", borderBottom: `1px solid ${E.line}` }}>
            {COLS.map((c, i) => {
              const rightAlign = i >= 1 && i <= 5;
              const pad = i === 0 ? { paddingLeft: 6 } : i === 6 ? { paddingLeft: 28 } : i >= 3 && i <= 5 ? { paddingRight: 13 } : rightAlign ? { paddingRight: 4 } : null;
              return (
                <span key={c} style={{ ...th, position: "relative", textAlign: rightAlign ? "right" : "left", ...pad }}>
                  {c}
                  <span role="separator" aria-orientation="vertical" aria-label={`Resize the ${c} column`} title="Drag to resize, double-click to reset all" onMouseDown={e => startDrag(i, e)} onDoubleClick={resetW}
                    style={{ position: "absolute", top: -4, bottom: -8, right: -8, width: 12, cursor: "col-resize", display: "flex", justifyContent: "center" }}>
                    <span aria-hidden style={{ width: 1, background: E.line }} />
                  </span>
                </span>
              );
            })}
          </div>
          {SAMPLE.map((r, i) => {
            const [bg, fg] = TINTS[i];
            const dayUp = r.dayPct >= 0;
            return (
              <div key={r.symbol} style={{ display: "grid", gridTemplateColumns: template, columnGap: 10, alignItems: "center", padding: "13px 0", borderBottom: `1px solid ${E.line}`, background: i % 2 ? E.band : "transparent" }}>
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
                  <div role="img" aria-label={`Weight ${r.weight.toFixed(1)}%`} style={{ height: 26, borderRadius: 5, background: E.tealSoft, overflow: "hidden" }}><div style={{ width: `${Math.min(100, r.weight * 3)}%`, minWidth: 52, height: "100%", background: E.teal, color: E.panel, display: "flex", alignItems: "center", paddingLeft: 8, boxSizing: "border-box", fontFamily: mono, fontSize: 12.5, fontWeight: 700, ...num }}>{r.weight.toFixed(1)}%</div></div>
                </div>
                <div style={{ padding: "0 4px" }}><DailyBars vs={r.closes} /></div>
                <div style={{ paddingRight: 18 }}>
                  <div aria-hidden style={{ position: "relative", height: 8, borderRadius: 4, background: `linear-gradient(90deg, ${E.down}, ${E.neutral} 50%, ${E.up})` }}>
                    <span style={{ position: "absolute", top: -5, left: `calc(${r.pos}% - 3px)`, width: 6, height: 18, borderRadius: 3, background: E.ink, border: `2px solid ${E.panel}`, boxSizing: "content-box", marginLeft: -2 }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 9, ...num }}>
                    <span><span style={{ display: "block", fontSize: 10.5, letterSpacing: 0.6, textTransform: "uppercase", color: E.mute }}>Low</span><span style={{ fontSize: 13.5, fontWeight: 600 }}>${r.low.toLocaleString("en-US")}</span></span>
                    <span style={{ textAlign: "right" }}><span style={{ display: "block", fontSize: 10.5, letterSpacing: 0.6, textTransform: "uppercase", color: E.mute }}>High</span><span style={{ fontSize: 13.5, fontWeight: 600 }}>${r.high.toLocaleString("en-US")}</span></span>
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
