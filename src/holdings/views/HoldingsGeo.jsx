// Geography: where the equity book lives, country by country. A globe or flat
// map shaded by share, and beside it the ranked list of countries. The basis is
// the listing venue of each underlying instrument, looked through fund
// holdings, so every figure is a floor and says so.
import React, { useRef, useState } from "react";
import { useT, FONT, hatch } from "../../shared/theme.jsx";
import { Frame, StateView, ProvenanceFooter, Segmented, StaleBadge, SrOnly, useReducedMotion } from "../../shared/ui.jsx";
import { CountryGlobe, CountryFlatMap, neName, SMALL, centreOfCountry, shadeFor } from "../../shared/charts/countrymap.jsx";

const p1 = v => (v == null ? "——" : `${(v * 100).toFixed(1)}%`);
const TOP_N = 10;

function Stat({ label, value, note }) {
  const t = useT();
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: FONT.mono, fontSize: 9, letterSpacing: 1.2, color: t.textMuted }}>{label}</div>
      <div style={{ fontFamily: FONT.mono, fontSize: 22, color: t.text, margin: "3px 0 1px" }}>{value}</div>
      <div style={{ fontSize: 10.5, color: t.textFaint }}>{note}</div>
    </div>
  );
}

export function GeoCountryView({ status, reason, asOf, source, basis, coverage, stale, region, regionState, countries = [], countryState, countryHoldings = {}, shares = {}, unseen = 0, listingUK, listingUnknown, view, setView, geoBasis = "origin", setGeoBasis, size = "l", page, refetch }) {
  const t = useT();
  const reduced = useReducedMotion();
  const form = view === "map" ? "map" : "globe";
  const [focus, setFocus] = useState(null);
  const [face, setFace] = useState(null);
  const nonce = useRef(0);
  const st = countryState && countryState.status !== "ready" ? countryState.status : regionState?.status === "ready" ? status : regionState?.status ?? status;

  const sorted = [...countries].sort((a, b) => b.weight - a.weight);
  const top = sorted.slice(0, TOP_N);
  const rest = sorted.slice(TOP_N).reduce((a, c) => a + c.weight, 0);
  const max = sorted[0]?.weight ?? 0;
  const shareByName = {}, small = {}, notes = {};
  for (const c of sorted) {
    if (SMALL[c.label]) small[c.label] = c.weight; else shareByName[neName(c.label)] = c.weight;
    const hs = countryHoldings[c.label];
    if (hs?.length) notes[SMALL[c.label] ? c.label : neName(c.label)] = `via ${hs.join(" · ")}`;
  }
  const hover = n => setFocus(n);
  const goTo = c => {
    const ll = centreOfCountry(c.label);
    if (form === "globe" && ll) { nonce.current += 1; setFace({ lon: ll[0], lat: ll[1], nonce: nonce.current }); }
  };
  const uk = shares.UK ?? 0;
  const lead = sorted[0];
  const sentence = !lead ? "" : `${lead.label} is at least ${p1(lead.weight)} of the equity book looking through the funds.`
    + (listingUK != null ? ` The UK is ${p1(listingUK)} by where each holding is listed and at least ${p1(uk)} underneath.` : "")
    + (listingUnknown ? ` ${p1(listingUnknown)} of holdings have no recognised listing.` : "");
  const summary = `Exposure by country, looking through funds: ${top.map(c => `${c.label} at least ${p1(c.weight)}`).join(", ") || "none measured"}; ${p1(unseen)} not disclosed.`;
  const stats = (
    <>
      <Stat label="LISTED IN THE UK" value={p1(listingUK)} note="by each holding's own listing" />
      <Stat label="UK UNDERNEATH" value={`≥${p1(uk)}`} note="looking through the funds" />
      <Stat label="NOT DISCLOSED" value={p1(unseen)} note="of the equity book" />
    </>
  );
  const focusKey = focus;

  return (
    <Frame id="geography" index={4} label="Geographic exposure"
      title={<span style={{ display: "inline-flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>Where the Equity Book <em style={{ fontWeight: 400 }}>Lives</em><span style={{ fontFamily: FONT.sans, fontStyle: "normal", fontWeight: 400, fontSize: 12, color: t.textMuted }}>{geoBasis === "listed" ? "By where each holding is listed, funds broken into their holdings" : "By each company's head-office country, funds broken into their holdings"}</span></span>}
      right={<><StaleBadge stale={stale} asOf={asOf} /><Segmented label="Basis" value={geoBasis} onChange={setGeoBasis} options={[{ value: "origin", label: "Head Office" }, { value: "listed", label: "Where Listed" }]} /><Segmented label="Geography view" value={form} onChange={setView} options={[{ value: "globe", label: "Globe" }, { value: "map", label: "Flat map" }]} /></>}
      footer={<ProvenanceFooter source={countryState?.source ?? regionState?.source ?? source} asOf={asOf} basis={countryState?.basis ?? regionState?.basis ?? basis} coverage={countryState?.coverage ?? regionState?.coverage ?? coverage} method={geoBasis === "listed" ? "Each fund decomposed by the listing venue of its disclosed holdings (ticker suffix); single equities by their own listing. A listing is not where a company earns its revenue. Undisclosed holdings are a separate share, never placed on the map. Every country figure is a floor." : "Each company placed by the head-office country in its Yahoo profile; funds decomposed by the disclosed holdings inside them. Head office is not where a company earns its revenue. Funds, and companies with no country on file, are shown as not disclosed, never placed. Every country figure is a floor."} />}>
      <StateView status={st} reason={countryState?.reason ?? regionState?.reason ?? reason} onRetry={refetch} height={320}>
        {region && (
          <div style={{ display: "grid", gridTemplateColumns: size === "s" ? "minmax(0,1fr)" : "minmax(0,1fr) 380px", gap: 32, alignItems: "stretch", paddingTop: 6 }}>
            <div style={{ minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
              {form === "globe" ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 36, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 22, minWidth: 180 }}>{stats}</div>
                  <CountryGlobe shares={shareByName} smallShares={small} notes={notes} focus={focusKey} onHover={hover} face={face} size={500} summary={summary} autoSpin={!reduced} />
                </div>
              ) : (
                <>
                  <div style={{ width: "100%", maxWidth: 880, margin: "0 auto" }}><CountryFlatMap shares={shareByName} smallShares={small} notes={notes} focus={focusKey} onHover={hover} summary={summary} /></div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 24, paddingTop: 12, borderTop: `1px solid ${t.borderSubtle}` }}>{stats}</div>
                </>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: form === "globe" ? "center" : "flex-start", fontSize: 10.5, color: t.textFaint }}>
                <span>0%</span>
                <span aria-hidden style={{ width: 120, height: 8, borderRadius: 2, background: `linear-gradient(90deg, ${shadeFor(t, 0.0001, 1)}, ${shadeFor(t, 1, 1)})` }} />
                <span>{max > 0 ? `≥${p1(max)}` : "top share"}</span>
                <span>· shade = share of the equity book (a floor) · grey = no measured exposure · {form === "globe" ? "drag to turn the globe" : "hover a country"}</span>
              </div>
            </div>
            <div style={{ minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 11.5, color: t.textMuted, marginBottom: 6 }}>Top {Math.min(TOP_N, top.length)} {top.length === 1 ? "country" : "countries"}</div>
              <div role="list" aria-label="Countries by share of the equity book">
                {top.length === 0 && <div style={{ fontSize: 12, color: t.textSecondary, padding: "10px 0" }}>No country has a measured exposure yet.</div>}
                {top.map((c, i) => {
                  const key = SMALL[c.label] ? c.label : neName(c.label);
                  const on = focusKey === key;
                  return (
                    <button key={c.label} role="listitem" onMouseEnter={() => hover(key)} onMouseLeave={() => hover(null)} onFocus={() => hover(key)} onBlur={() => hover(null)} onClick={() => goTo(c)}
                      style={{ display: "grid", gridTemplateColumns: "22px minmax(0,1fr) 92px 58px", gap: 10, alignItems: "center", width: "100%", textAlign: "left", cursor: "pointer", padding: "9px 4px", border: "none", borderTop: `1px solid ${t.borderSubtle}`, background: on ? t.surfaceInset : "transparent", color: t.text, fontFamily: FONT.sans }}>
                      <span style={{ fontSize: 11.5, color: t.textFaint }}>{i + 1}</span>
                      <span style={{ minWidth: 0 }}>
                        <span style={{ display: "block", fontSize: 13 }}>{c.label}</span>
                        {countryHoldings[c.label]?.length > 0 && <span style={{ display: "block", fontFamily: FONT.mono, fontSize: 9.5, color: t.textFaint, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{countryHoldings[c.label].join(" · ")}</span>}
                      </span>
                      <span aria-hidden style={{ height: 6, background: t.surfaceInset, borderRadius: 2, position: "relative" }}><span style={{ position: "absolute", inset: 0, width: `${(c.weight / (max || 1)) * 100}%`, background: t.info, borderRadius: 2 }} /></span>
                      <span style={{ fontFamily: FONT.mono, fontSize: 12.5, textAlign: "right" }}>≥{(c.weight * 100).toFixed(1)}%</span>
                    </button>
                  );
                })}
                {rest > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "22px minmax(0,1fr) 92px 58px", gap: 10, padding: "9px 4px", borderTop: `1px solid ${t.borderSubtle}`, fontSize: 12, color: t.textSecondary }}>
                    <span /><span>Other countries</span><span /><span style={{ fontFamily: FONT.mono, textAlign: "right" }}>≥{(rest * 100).toFixed(1)}%</span>
                  </div>
                )}
                {unseen > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "22px minmax(0,1fr) 92px 58px", gap: 10, alignItems: "center", padding: "9px 4px", borderTop: `1px solid ${t.borderSubtle}`, fontSize: 12, color: t.textFaint }}>
                    <span /><span>Not disclosed <span style={{ fontSize: 10 }}>(undisclosed fund holdings)</span></span>
                    <span aria-hidden style={{ height: 6, borderRadius: 2, background: hatch(t), width: `${Math.min(100, (unseen / (max || 1)) * 100)}%` }} />
                    <span style={{ fontFamily: FONT.mono, textAlign: "right" }}>{(unseen * 100).toFixed(1)}%</span>
                  </div>
                )}
              </div>
              {sentence && <p style={{ margin: "12px 0 0", fontSize: 11.5, lineHeight: 1.55, color: t.textMuted }}>{sentence}</p>}
            </div>
            <SrOnly>{summary}</SrOnly>
          </div>
        )}
      </StateView>
    </Frame>
  );
}
