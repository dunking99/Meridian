// Movers (winners and losers) and the ledger that opens the inspector beside
// the table. Both only draw what the hooks hand them.
import React from "react";
import { useT, FONT, signColour } from "../../shared/theme.jsx";
import { Card, Frame, StateView, ProvenanceFooter, Segmented, Muted, StaleBadge, SrOnly } from "../../shared/ui.jsx";
import { Sparkline } from "../../shared/charts/line.jsx";
import { gbp, pct } from "../../shared/format.js";
import { UpDownView } from "./HoldingsTop.jsx";
import { HoldingsTableView } from "./HoldingsMore.jsx";
import { InspectorView } from "./HoldingsTop.jsx";

const PERIODS = [{ value: "today", label: "Today" }, { value: "1W", label: "1W" }, { value: "1M", label: "1M" }, { value: "YTD", label: "YTD" }, { value: "total", label: "Total" }];
const PHRASE = { today: "today", "1W": "over the last week", "1M": "over the last month", YTD: "this year so far", total: "since bought" };
const PER_SIDE = 5;

function Row({ r, onPick, selected }) {
  const t = useT();
  const c = signColour(t, r.pct);
  return (
    <button onClick={() => onPick(r.symbol)} aria-pressed={selected}
      style={{ flex: 1, minHeight: 44, display: "grid", gridTemplateColumns: "34px minmax(0,1fr) minmax(60px, 110px) auto", alignItems: "center", gap: 10, width: "100%", textAlign: "left", cursor: "pointer",
        background: selected ? t.surfaceInset : "transparent", border: "none", borderBottom: `1px solid ${t.borderSubtle}`, padding: "4px 2px", color: t.text, fontFamily: FONT.sans }}>
      <span aria-hidden style={{ width: 32, height: 32, borderRadius: "50%", background: t.surfaceInset, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.mono, fontSize: r.symbol.length > 4 ? 7 : 9, fontWeight: 700, color: t.textSecondary }}>{r.symbol.replace(/\..*$/, "").slice(0, 4)}</span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontWeight: 700, fontSize: 13, fontFamily: FONT.mono }}>{r.symbol}</span>
        <span style={{ display: "block", fontSize: 10.5, color: t.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
      </span>
      <span style={{ justifySelf: "center" }}>{r.spark?.length > 1 ? <Sparkline values={r.spark} width={96} height={26} colour={c} label={`${r.symbol} recent closes`} /> : null}</span>
      <span style={{ textAlign: "right", fontFamily: FONT.mono }}>
        <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: c }}>{pct(r.pct, { dp: 2 })}</span>
        <span style={{ display: "block", fontSize: 10.5, color: t.textSecondary }}>{r.gbp == null ? "" : gbp(r.gbp, { sign: true })}</span>
      </span>
    </button>
  );
}

export function MoversView({ status, reason, asOf, source, basis, coverage, stale, rows = [], returns = [], period, setPeriod, page, refetch }) {
  const t = useT();
  const rMap = Object.fromEntries(returns.map(r => [r.symbol, r]));
  const items = rows.filter(r => r.value > 0).map(r => {
    const w = rMap[r.symbol];
    const win = w?.windows?.[period];
    const v = period === "today" ? { pct: r.dayPct, gbp: r.dayGBP } : period === "total" ? { pct: r.pnlPct, gbp: r.pnl } : { pct: win?.returnPct ?? null, gbp: win?.gbp ?? null };
    return { symbol: r.symbol, name: r.name, ...v, spark: w?.spark?.length > 1 ? w.spark : r.closes30 };
  });
  const measured = items.filter(i => i.pct != null);
  const missing = items.filter(i => i.pct == null).map(i => i.symbol);
  const winners = measured.filter(i => i.pct > 0).sort((a, b) => b.pct - a.pct).slice(0, PER_SIDE);
  const losers = measured.filter(i => i.pct < 0).sort((a, b) => a.pct - b.pct).slice(0, PER_SIDE);
  const pick = s => page?.setSelected?.(page.selected === s ? null : s);
  const lead = winners[0], trail = losers[0];
  const subtitle = !measured.length ? "" : `${lead ? `${lead.symbol} leads` : "Nothing is up"}${trail ? `, ${trail.symbol} trails` : ", nothing is down"} ${PHRASE[period]}.`;
  const summary = `Winners ${PHRASE[period]}: ${winners.map(w => `${w.symbol} ${pct(w.pct, { dp: 2 })}`).join(", ") || "none"}. Losers: ${losers.map(w => `${w.symbol} ${pct(w.pct, { dp: 2 })}`).join(", ") || "none"}.`;
  return (
    <Frame id="movers" label="Movers" title="Winners and losers" fill grow
      right={<><StaleBadge stale={stale} asOf={asOf} /><Segmented label="Period" value={period} onChange={setPeriod} options={PERIODS} /></>}
      footer={<ProvenanceFooter source={source} asOf={asOf} basis={basis} coverage={coverage} method="Today uses the live price move; 1W, 1M and YTD replay stored closes at today's share counts; Total is unrealised gain on cost. Only holdings that actually rose or fell are listed." />}>
      <StateView status={status} reason={reason} onRetry={refetch} height={300}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }} role="list" aria-label="Winners and losers">
          {winners.length ? winners.map(r => <Row key={r.symbol} r={r} onPick={pick} selected={page?.selected === r.symbol} />) : <div style={{ flex: 1, display: "flex", alignItems: "center" }}><Muted>No holding is up {PHRASE[period]}.</Muted></div>}
          <div aria-hidden style={{ borderTop: `1px dashed ${t.borderStrong}`, margin: "4px 0" }} />
          {losers.length ? losers.map(r => <Row key={r.symbol} r={r} onPick={pick} selected={page?.selected === r.symbol} />) : <div style={{ flex: 1, display: "flex", alignItems: "center" }}><Muted>No holding is down {PHRASE[period]}.</Muted></div>}
        </div>
        {missing.length > 0 && <Muted size={10}>No {PHRASE[period]} reading for {missing.join(", ")}.</Muted>}
        <SrOnly>{summary}</SrOnly>
      </StateView>
    </Frame>
  );
}

// The table takes the full width. Selecting a holding opens the inspector on
// the right and the table condenses (it drops its wide columns) to make room.
export function LedgerView({ table, inspector, page, size }) {
  const open = !!page?.selected && !String(page.selected).includes(":");
  // Both columns are the same height: the table card stretches to match the
  // inspector, and the inspector scrolls inside its own column, so neither
  // leaves a gap under the other.
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "stretch" }}>
      <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column" }}><HoldingsTableView {...table} condensed={open} size={size} page={page} /></div>
      {open && (
        <div style={{ flex: "0 0 clamp(340px, 30%, 480px)", minWidth: 0, position: "relative", minHeight: 560 }}>
          <div style={{ position: "absolute", inset: 0, overflowY: "auto" }}><InspectorView {...inspector} page={page} /></div>
        </div>
      )}
    </div>
  );
}

// Geography, the companion box: the home-bias reading and which holdings sit
// in each region. Basis is each holding's own listing venue (a fund counts
// where it is listed, not where its contents are), and says so.
export function GeoDetailView({ status, reason, asOf, source, basis, coverage, stale, rows = [], listingUK, listingUnknown, lookUK, page, refetch }) {
  const t = useT();
  const invested = rows.reduce((a, r) => a + (r.value ?? 0), 0);
  const groups = Object.values(rows.filter(r => r.value > 0).reduce((m, r) => {
    const k = r.region ?? "No recognised listing";
    (m[k] ??= { region: k, weight: 0, items: [] });
    m[k].weight += r.weight ?? 0;
    m[k].items.push(r);
    return m;
  }, {})).sort((a, b) => b.weight - a.weight);
  const p = v => (v == null ? "——" : `${(v * 100).toFixed(1)}%`);
  return (
    <Frame id="geo-detail" fill label="Geography detail" title="Who sits where"
      right={<StaleBadge stale={stale} asOf={asOf} />}
      footer={<ProvenanceFooter source={source} asOf={asOf} basis="By each holding's own listing venue" coverage={coverage} method="A fund is placed where it is listed. The look-through figure in the box beside it is separate and is only a floor." />}>
      <StateView status={status} reason={reason} onRetry={refetch} height={220}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[["Listed in the UK", p(listingUK), "by each holding's own listing"], ["UK underneath", `≥${p(lookUK)}`, "looking through the funds (a floor)"]].map(([k, v, n]) => (
            <div key={k} style={{ padding: 10, borderRadius: 6, background: t.surfaceInset }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 9, letterSpacing: 1.2, color: t.textMuted }}>{k.toUpperCase()}</div>
              <div style={{ fontFamily: FONT.mono, fontSize: 20, color: t.text, margin: "2px 0" }}>{v}</div>
              <div style={{ fontSize: 10, color: t.textFaint }}>{n}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: t.textSecondary, lineHeight: 1.5 }}>
          <b style={{ color: t.text }}>Home-bias check.</b> A London-listed global tracker counts as UK on the first basis and mostly not on the second.{listingUnknown ? ` ${p(listingUnknown)} of holdings have no recognised listing.` : ""}
        </div>
        <div style={{ marginTop: 10, flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: 12 }}>
          {groups.map(g => (
            <div key={g.region} style={{ borderTop: `1px solid ${t.borderSubtle}`, paddingTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 5 }}>
                <span style={{ color: t.text, fontWeight: 600 }}>{g.region}</span>
                <span style={{ fontFamily: FONT.mono, color: t.textSecondary }}>{pct(g.weight, { dp: 1, sign: false })}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {g.items.sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0)).map(r => (
                  <button key={r.symbol} onClick={() => page?.setSelected?.(page.selected === r.symbol ? null : r.symbol)} aria-pressed={page?.selected === r.symbol}
                    style={{ cursor: "pointer", background: page?.selected === r.symbol ? t.surfaceInset : "transparent", border: `1px solid ${t.border}`, borderRadius: 12, padding: "2px 8px", color: t.text, fontFamily: FONT.mono, fontSize: 10.5 }}>
                    {r.symbol} <span style={{ color: t.textMuted }}>{pct(r.weight, { dp: 1, sign: false })}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <SrOnly>{`Holdings by listing region: ${groups.map(g => `${g.region} ${(g.weight).toFixed(1)}%`).join(", ")}.`}</SrOnly>
      </StateView>
    </Frame>
  );
}

// One box holding the up/down ribbon over the winners and losers.
export function MoversPanelView({ upDown, movers, page }) {
  const t = useT();
  return (
    <Card id="movers-panel">
      <UpDownView {...upDown} size="s" page={page} />
      <div aria-hidden style={{ borderTop: `1px solid ${t.borderSubtle}`, margin: "0 14px" }} />
      <MoversView {...movers} page={page} />
    </Card>
  );
}
