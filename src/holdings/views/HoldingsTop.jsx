// Holdings views: key info strip (HD-04), up/down ribbon (HD-22), weight
// ribbon (HD-09), treemap (HD-06) and the position inspector (HD-20).
import React, { useState } from "react";
import { useT, FONT, soft, signColour, cat } from "../../shared/theme.jsx";
import { Frame, StateView, ProvenanceFooter, Segmented, Muted, StaleBadge, Chip, SrOnly, Stat, NoData, CoverageBar } from "../../shared/ui.jsx";
import { Ribbon, RangeTrack } from "../../shared/charts/bars.jsx";
import { Treemap, Sunburst } from "../../shared/charts/shapes.jsx";
import { LineChart } from "../../shared/charts/line.jsx";
import { gbp, gbpCompact, pct, price, pp, date, num } from "../../shared/format.js";

// ─── HD-04 ────────────────────────────────────────────────────
export function KeyInfoView({ status, data: d, reason, asOf, source, basis, coverage, stale, best, worst, bestDay, worstDay, size = "m", page, refetch }) {
  const t = useT();
  const [form, setForm] = useState("values");
  const tt = d?.totals;
  return (
    <Frame id="key-info" label="Holdings" right={<><StaleBadge stale={stale} asOf={asOf} /><Segmented label="Key info form" value={form} onChange={setForm} options={[{ value: "values", label: "Values" }, { value: "count", label: "Positions" }, { value: "best", label: "Best / worst" }]} /></>}
      footer={<ProvenanceFooter source={source} asOf={asOf} basis={basis} coverage={coverage} />}>
      <StateView status={status} reason={reason} onRetry={refetch} height={70}>
        {tt && form === "values" && (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${size === "s" ? 2 : 4}, minmax(0,1fr))` }}>
            <Stat label="Market value" value={gbp(tt.value)} sub={`+ cash ${gbpCompact(tt.cash)} = ${gbpCompact(tt.total)}`} />
            <Stat label="Cost basis" value={gbp(tt.cost)} sub="average cost × quantity" />
            <Stat label="Unrealised" value={gbp(tt.pnl, { sign: true })} sign={tt.pnl} sub={pct(tt.pnlPct, { dp: 1 })} />
            <Stat label="Day P&L" value={gbp(tt.dayGBP, { sign: true })} sign={tt.dayGBP} sub={pct(tt.dayPct)} onClick={() => page?.onNavigate?.("changed")} />
          </div>
        )}
        {tt && form === "count" && (
          <div style={{ display: "flex", gap: 20, alignItems: "baseline", flexWrap: "wrap", padding: "6px 10px" }}>
            <span style={{ fontFamily: FONT.serif, fontSize: 26, color: t.text }}>{tt.positions} positions</span>
            <span style={{ fontFamily: FONT.mono, fontSize: 12 }}><span style={{ color: t.positive }}>▲ {tt.up} up</span> · {tt.flat} flat · <span style={{ color: t.negative }}>▼ {tt.down} down</span>{tt.noMove ? ` · ${tt.noMove} no quote` : ""}</span>
            {d.partial && <span style={{ fontSize: 11, color: t.warning }}>⚠ {d.excluded.map(e => e.symbol).join(", ")} unpriced — excluded from totals</span>}
          </div>
        )}
        {tt && form === "best" && (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${size === "s" ? 2 : 4}, minmax(0,1fr))` }}>
            {[["Best since bought", best, "pnlPct"], ["Worst since bought", worst, "pnlPct"], ["Best today", bestDay, "dayPct"], ["Worst today", worstDay, "dayPct"]].map(([l, r, k]) => (
              <Stat key={l} label={l} value={r ? `${r.symbol} ${pct(r[k], { dp: k === "dayPct" ? 2 : 1 })}` : null} sign={r?.[k]} sub={r?.name} onClick={r ? () => page?.onOpenHolding?.(r.symbol) : undefined} reason="No priced holding" />
            ))}
          </div>
        )}
      </StateView>
    </Frame>
  );
}

// ─── HD-22 ────────────────────────────────────────────────────
export function UpDownView({ status, data: d, reason, asOf, source, basis, coverage, stale, size = "m", page, refetch }) {
  const t = useT();
  const [by, setBy] = useState("count");
  const tt = d?.totals;
  const segs = tt ? [["up", tt.up, tt.upWeight, t.positive], ["flat", tt.flat, Math.max(0, 100 - tt.upWeight - tt.downWeight - (tt.cash / tt.total * 100)), t.textFaint], ["down", tt.down, tt.downWeight, t.negative]] : [];
  const total = by === "count" ? segs.reduce((a, s) => a + s[1], 0) : segs.reduce((a, s) => a + s[2], 0);
  const active = page?.filters?.move;
  return (
    <Frame id="up-down" label="Up / down today" right={<><StaleBadge stale={stale} asOf={asOf} /><Segmented label="Ribbon by" value={by} onChange={setBy} options={[{ value: "count", label: "Count" }, { value: "weight", label: "Weight" }]} /></>}
      footer={<ProvenanceFooter source={source} asOf={asOf} basis={basis} coverage={coverage} note="Click a segment to filter the table; click it again to clear." />}>
      <StateView status={status} reason={reason} onRetry={refetch} height={50}>
        {tt && total > 0 && (
          <div role="group" aria-label={`${tt.up} up, ${tt.flat} flat, ${tt.down} down; ${tt.upWeight}% of the book up, ${tt.downWeight}% down`}>
            <div style={{ display: "flex", height: 16, borderRadius: 4, overflow: "hidden" }}>
              {segs.map(([k, n, w, c]) => { const v = by === "count" ? n : w; return v > 0 && (
                <button key={k} onClick={() => page?.setFilters?.(f => ({ ...f, move: f.move === k ? null : k }))} aria-pressed={active === k} title={`${k}: ${n} holdings, ${w.toFixed(1)}% of the book`}
                  style={{ width: `${v / total * 100}%`, background: c, border: active === k ? `2px solid ${t.text}` : "none", opacity: active && active !== k ? 0.35 : 1, cursor: "pointer" }} />
              ); })}
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 4, fontFamily: FONT.mono, fontSize: 11 }}>
              <span style={{ color: t.positive }}>▲ {tt.up} · {tt.upWeight.toFixed(1)}%</span><span style={{ color: t.textMuted }}>▪ {tt.flat}</span><span style={{ color: t.negative }}>▼ {tt.down} · {tt.downWeight.toFixed(1)}%</span>{tt.noMove ? <span style={{ color: t.textFaint }}>{tt.noMove} no quote</span> : null}
            </div>
          </div>
        )}
      </StateView>
    </Frame>
  );
}

// ─── HD-09 ────────────────────────────────────────────────────
export function WeightRibbonView({ status, reason, asOf, source, basis, coverage, stale, segs = [], cashShare = 0, total, group, setGroup, filtered, size = "m", page, refetch }) {
  const t = useT();
  const grp = group === "region" ? "position" : group;
  const sel = page?.selected;
  const segments = [...segs.map((s, i) => ({ ...s, colour: cat(t, i) })), ...(cashShare > 0 && grp === "position" ? [{ key: "Cash", label: "Cash", share: cashShare, colour: t.textFaint, cash: true }] : [])];
  const selKey = sel && !String(sel).includes(":") ? (grp === "position" ? sel : segs.find(s => s.members.includes(sel))?.key) : null;
  const anyTarget = segs.some(s => s.targetShare != null);
  const gaps = segments.filter(s => s.driftPp != null).sort((x, y) => Math.abs(y.driftPp) - Math.abs(x.driftPp)).slice(0, 7);
  const summary = `${segs.length} groups by ${grp}: ${segs.slice(0, 6).map(s => `${s.label} ${(s.share * 100).toFixed(1)}%`).join(", ")}`;
  const rowLabel = { fontSize: 11.5, color: t.textMuted, marginBottom: 4 };
  return (
    <Frame id="weight-ribbon" title="Weight against target"
      right={<><StaleBadge stale={stale} asOf={asOf} /><Segmented label="Group by" value={grp} onChange={setGroup} options={[{ value: "position", label: "Holding" }, { value: "class", label: "Class" }, { value: "sector", label: "Sector" }, { value: "currency", label: "Currency" }]} /></>}
      footer={<ProvenanceFooter source={source} asOf={asOf} basis={basis} coverage={coverage} note={filtered ? "Filtered: only rows matching the page filters are drawn." : null} />}>
      <StateView status={status} reason={reason} onRetry={refetch} height={80}>
        {segs.length > 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", ...rowLabel }}><span>Current</span>{total != null && <span style={{ fontFamily: FONT.mono }}>{gbp(total)}</span>}</div>
            <div role="list" aria-label={summary} style={{ display: "flex", gap: 1, height: 46 }}>
              {segments.map(s => {
                const on = selKey === s.key;
                const txt = `${s.label} ${Math.round(s.share * 100)}%`;
                const pick = grp === "position" && !s.cash;
                return (
                  <button key={s.key} role="listitem" title={`${s.label}: ${(s.share * 100).toFixed(1)}%${s.value != null ? ` · ${gbpCompact(s.value)}` : ""}${s.targetShare != null ? ` · target ${(s.targetShare * 100).toFixed(1)}%` : ""}`} aria-pressed={on}
                    onClick={() => pick && page?.setSelected?.(page.selected === s.key ? null : s.key)}
                    style={{ flex: `${s.share} 1 0`, minWidth: 3, border: "none", padding: "0 0 0 8px", textAlign: "left", cursor: pick ? "pointer" : "default", background: s.colour, color: t.surface,
                      fontFamily: FONT.sans, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", opacity: selKey && !on ? 0.4 : 1, outline: on ? `2px solid ${t.text}` : "none", outlineOffset: -2 }}>
                    {s.share >= 0.04 ? txt : ""}
                  </button>
                );
              })}
            </div>
            {anyTarget ? (
              <>
                <div style={{ ...rowLabel, marginTop: 10 }}>Target</div>
                <div role="img" aria-label="Target weights" style={{ display: "flex", gap: 1, height: 14 }}>
                  {segments.map(s => <div key={s.key} title={`${s.label} target ${s.targetShare == null ? "none set" : `${(s.targetShare * 100).toFixed(1)}%`}`} style={{ flex: `${s.targetShare ?? 0} 1 0`, background: s.colour, opacity: 0.75 }} />)}
                </div>
                {gaps.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 18px", marginTop: 10, fontSize: 12, color: t.textMuted }}>
                    <span>Largest gaps to target</span>
                    {gaps.map(s => (
                      <span key={s.key} style={{ display: "inline-flex", gap: 6, alignItems: "center", color: t.text }}>
                        <span aria-hidden style={{ width: 10, height: 10, borderRadius: 2, background: s.colour }} />{s.label}
                        <span style={{ fontFamily: FONT.mono, color: s.driftPp > 0 ? t.negative : t.positive }}>{s.driftPp > 0 ? "+" : "−"}{Math.abs(s.driftPp).toFixed(1)} pts</span>
                      </span>
                    ))}
                  </div>
                )}
              </>
            ) : <div style={{ marginTop: 10, fontSize: 12, color: t.textMuted }}>No targets set yet, so there is nothing to compare against. Set a target on a holding and its gap appears here.</div>}
          </>
        )}
        <SrOnly>{summary}</SrOnly>
      </StateView>
    </Frame>
  );
}

// ─── HD-06 ────────────────────────────────────────────────────
const MODES = [{ value: "today", label: "Today" }, { value: "1W", label: "1W" }, { value: "1M", label: "1M" }, { value: "YTD", label: "YTD" }, { value: "total", label: "Total Gain" }, { value: "drift", label: "Drift" }];
export function TreemapView({ status, reason, asOf, source, basis, coverage, stale, rows = [], returns = [], mode, setMode, group, setGroup, size = "m", props = {}, page, refetch }) {
  const t = useT();
  const [form, setForm] = useState("treemap");
  const rMap = Object.fromEntries(returns.map(r => [r.symbol, r]));
  const colourOf = r => mode === "today" ? r.dayPct : mode === "total" ? r.pnlPct : mode === "drift" ? r.driftPp : rMap[r.symbol]?.windows?.[mode]?.returnPct ?? null;
  const clip = mode === "today" ? 3 : mode === "1W" ? 5 : mode === "drift" ? 5 : mode === "1M" ? 10 : 30;
  const items = rows.filter(r => r.value > 0).map(r => ({ key: r.symbol, label: r.symbol, sub: r.name, value: r.value, share: r.weight, colourValue: colourOf(r),
    group: group === "sector" ? (r.sector ?? "Unclassified") : group === "currency" ? r.currency : r.type }));
  const missing = items.filter(i => i.colourValue == null).map(i => i.key);
  const label = MODES.find(m => m.value === mode)?.label;
  const summary = `Treemap of ${items.length} holdings sized by value, coloured by ${label}: ${items.slice(0, 5).map(i => `${i.label} ${i.colourValue == null ? "no reading" : i.colourValue.toFixed(1)}`).join(", ")}.`;
  const tree = Object.values(items.reduce((m, i) => { (m[i.group] ??= { id: `g:${i.group}`, label: i.group, value: 0, weight: 0, children: [] }); m[i.group].value += i.value; m[i.group].weight += i.share / 100; m[i.group].children.push({ id: `h:${i.key}`, label: i.key, name: i.sub, symbol: i.key, value: i.value, weight: i.share / 100, leaf: true }); return m; }, {}));
  return (
    <Frame id="treemap" title="Portfolio map" fill grow
      right={<>
        <StaleBadge stale={stale} asOf={asOf} />
        <Segmented label="Group by" value={group} onChange={setGroup} options={[{ value: "class", label: "Class" }, { value: "sector", label: "Sector" }, { value: "currency", label: "Currency" }]} />
        <Segmented label="Map form" value={form} onChange={setForm} options={[{ value: "treemap", label: "Treemap" }, { value: "sunburst", label: "Sunburst" }]} />
        <Segmented label="Colour mode" value={mode} onChange={setMode} options={MODES} />
      </>}>
      <StateView status={status} reason={reason} onRetry={refetch} height={260}>
        {items.length > 0 && form === "treemap" && (
          <Treemap items={items} grouped fill legend={false} height={size === "s" ? 240 : 440} clip={clip} legendLabel={label} summary={summary}
            format={mode === "drift" ? v => pp(v) : v => pct(v, { dp: mode === "today" ? 2 : 1 })}
            selected={page?.selected} onSelect={r => page?.setSelected?.(page.selected === r.key ? null : r.key)} />
        )}
        {items.length > 0 && form === "sunburst" && <div style={{ display: "flex", justifyContent: "center" }}><Sunburst tree={tree} size={size === "s" ? 220 : 280} centreValue={gbpCompact(items.reduce((a, i) => a + i.value, 0))} centreLabel="Invested" summary={summary} onSelect={n => n.symbol && page?.setSelected?.(page.selected === n.symbol ? null : n.symbol)} /></div>}
        {mode === "drift" && !rows.some(r => r.targetPct != null) && <Muted>No targets set, so every tile is hatched: drift needs a target.</Muted>}
        {missing.length > 0 && mode !== "drift" && <Muted size={10}>No {label} reading for {missing.join(", ")} (hatched).</Muted>}
        {page?.selected && !String(page.selected).includes(":") && <Muted size={10}>Selected {page.selected} — its inspector opens beside the ledger below. Esc clears.</Muted>}
      </StateView>
    </Frame>
  );
}

// ─── HD-20 inspector ──────────────────────────────────────────
function Block({ title, children, reason }) {
  const t = useT();
  return (
    <div style={{ padding: "7px 0", borderTop: `1px solid ${t.borderSubtle}` }}>
      <div style={{ fontFamily: FONT.mono, fontSize: 9, letterSpacing: 1.2, color: t.textMuted, marginBottom: 4 }}>{title}</div>
      {reason ? <Muted size={10.5}>{reason}</Muted> : children}
    </div>
  );
}

export function InspectorView({ status, data: d, reason, asOf, source, basis, coverage, row, bars = [], historyState, riskShare, riskReason, symbol, size = "m", props = {}, page, refetch }) {
  const t = useT();
  const [range, setRange] = useState("1Y");
  const [drawer, setDrawer] = useState(false);
  const n = { "3M": 63, "1Y": 252, "3Y": 756, MAX: 99999 }[range];
  const sl = bars.slice(-n);
  const p = d?.position;
  const body = (
    <>
      {status === "idle" ? <Muted>Select a holding on the map, ribbon or table to inspect it here.</Muted> : (
        <StateView status={status} reason={reason} onRetry={refetch} height={200}>
          {d && (
            <>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontFamily: FONT.serif, fontSize: 22, color: t.text }}>{d.symbol}</span>
                <span style={{ fontSize: 11, color: t.textMuted }}>{d.name}</span>
                <span style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                  <button onClick={() => page?.onOpenHolding?.(d.symbol)} style={{ background: "transparent", border: `1px solid ${t.border}`, color: t.textSecondary, borderRadius: 3, fontSize: 10, cursor: "pointer" }}>Full panel</button>
                  {page?.selected && <button onClick={() => page.setSelected(null)} aria-label="Close inspector (Esc)" title="Close (Esc)" style={{ background: "transparent", border: `1px solid ${t.border}`, color: t.textSecondary, borderRadius: 3, fontSize: 12, cursor: "pointer" }}>✕</button>}
                  {!props.drawer && <button onClick={() => setDrawer(true)} aria-label="Open as drawer" style={{ background: "transparent", border: `1px solid ${t.border}`, color: t.textSecondary, borderRadius: 3, fontSize: 10, cursor: "pointer" }}>⤢</button>}
                </span>
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", margin: "4px 0" }}>{[d.instrument?.label, row?.sector, row?.region ? `listed ${row.region}` : null, row?.wrapper].filter(Boolean).map(x => <Chip key={x}>{x}</Chip>)}</div>
              {p && <div style={{ fontFamily: FONT.mono, fontSize: 18, color: t.text }}>{price(p.price, p.currency)} <span style={{ fontSize: 12, color: signColour(t, p.dayChangePct) }}>{pct(p.dayChangePct)} today</span></div>}
              <Block title="OWN PRICE CHART" reason={historyState === "refused" ? "No stored price history." : null}>
                <Segmented label="Chart range" value={range} onChange={setRange} options={["3M", "1Y", "3Y", "MAX"]} />
                {sl.length > 1 && <LineChart dates={sl.map(b => b.date)} series={[{ key: "c", label: d.symbol, values: sl.map(b => b.adj_close ?? b.close), colour: t.text, area: true }]} height={120} format={v => v.toFixed(2)} summary={`${d.symbol} closes over ${range}: from ${sl[0].close} to ${sl[sl.length - 1].close}`} />}
              </Block>
              <Block title="POSITION" reason={!p ? "Not currently held." : null}>
                {p && [["Quantity", num(p.qty, { dp: p.qty % 1 ? 4 : 0 })], ["Average cost", price(p.avgPrice, p.currency)], ["Market value", gbp(p.value)], ["Weight · target", `${pct(p.weight, { dp: 1, sign: false })} · ${p.targetPct != null ? `${p.targetPct}%` : "no target"}`], ["Unrealised", `${gbp(p.pnl, { sign: true })} · ${pct(p.pnlPct, { dp: 1 })}`], ["Risk share", riskShare != null ? `${riskShare.toFixed(1)}% of variance` : (riskReason ?? "not measured")], ["Income · yield", "not tracked yet"], ["Fee drag", row?.feeDragGBP != null ? `${gbp(row.feeDragGBP)} a year (${row.expenseRatioPct}%)` : "no published expense ratio"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, padding: "2px 0" }}><span style={{ color: t.textSecondary }}>{k}</span><span style={{ fontFamily: FONT.mono, color: t.text, textAlign: "right" }}>{v}</span></div>
                ))}
              </Block>
              <Block title="52-WEEK RANGE" reason={!d.range52?.available ? d.range52?.reason : null}>
                {d.range52?.available && <RangeTrack low={d.range52.low} high={d.range52.high} value={p?.price} lowDate={row?.range52?.lowDate} highDate={row?.range52?.highDate} />}
              </Block>
              <Block title="LOOK-THROUGH" reason={d.composition?.reason ?? (!d.composition?.topHoldings?.length ? "Publishes no holdings to look through." : null)}>
                {(d.composition?.topHoldings ?? []).slice(0, 5).map(h => <div key={h.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}><span style={{ color: t.textSecondary }}>{h.name}</span><span style={{ fontFamily: FONT.mono }}>≥{h.weight.toFixed(1)}%</span></div>)}
                {d.composition?.topHoldings?.length > 0 && <CoverageBar share={d.composition.topHoldings.reduce((a, h) => a + h.weight, 0) / 100} label="Disclosed" note="Top holdings only — a floor, never scaled up." />}
              </Block>
              <Block title="TRANSACTIONS" reason={!row?.transactions?.length ? "No transactions recorded for this holding — history before the log is not known." : null}>
                {(row?.transactions ?? []).slice(0, 5).map((x, i) => <div key={i} style={{ fontFamily: FONT.mono, fontSize: 10.5, color: t.textSecondary }}>{x.date} {x.side} {x.qty} @ {x.price}{x.fees ? ` · fees £${x.fees}` : ""}</div>)}
              </Block>
              <Block title="THESIS" reason={!d.thesis ? "No thesis written. Add one from the full panel." : null}><div style={{ fontSize: 11.5, color: t.textSecondary, whiteSpace: "pre-wrap" }}>{d.thesis}</div></Block>
              <Block title="NEWS" reason={!d.news?.length ? "No stored story names this holding in the last 60 days." : null}>
                {(d.news ?? []).slice(0, 3).map((x, i) => <a key={i} href={x.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", fontSize: 11, color: t.text, textDecoration: "none", padding: "2px 0" }}>{x.title}</a>)}
              </Block>
            </>
          )}
        </StateView>
      )}
    </>
  );
  return (
    <>
      <Frame id="inspector" label="Position inspector" footer={<ProvenanceFooter source={source} asOf={asOf} basis={basis} coverage={coverage} note="Each block degrades on its own." />}>{body}</Frame>
      {drawer && (
        <div role="dialog" aria-label={`${symbol} inspector`} onKeyDown={e => { if (e.key === "Escape") setDrawer(false); }}
          style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(440px, 94vw)", zIndex: 500, background: t.surface, borderLeft: `1px solid ${t.borderStrong}`, overflowY: "auto", padding: 14, boxShadow: `-12px 0 30px ${soft(t.appBg, 60)}` }}>
          <button autoFocus onClick={() => setDrawer(false)} aria-label="Close drawer (Esc)" style={{ float: "right", background: "transparent", border: "none", color: t.textMuted, fontSize: 20, cursor: "pointer" }}>×</button>
          {body}
        </div>
      )}
    </>
  );
}
