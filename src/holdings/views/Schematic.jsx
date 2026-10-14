// Plain reference version of the weight ribbon: real title and controls, one
// neutral bar. Swap back in registry.js (the WeightRibbon line) for the real view.
import React from "react";
import { useT, FONT } from "../../shared/theme.jsx";
import { Frame, StateView, ProvenanceFooter, Segmented } from "../../shared/ui.jsx";

export function WeightRibbonSchematic({ status, reason, asOf, source, basis, coverage, segs = [], total, group, setGroup, refetch }) {
  const t = useT();
  const grp = group === "region" ? "position" : group;
  const anyTarget = segs.some(s => s.targetShare != null);
  const bar = (h, share, text) => segs.map(s => (
    <div key={s.key} title={`${s.label} ${(s.share * 100).toFixed(1)}%`} style={{ flex: `${share(s) ?? 0} 1 0`, minWidth: 1, height: h, background: t.surfaceInset, border: `1px solid ${t.borderStrong}`, marginLeft: -1, boxSizing: "border-box", overflow: "hidden", whiteSpace: "nowrap", padding: "0 6px", display: "flex", alignItems: "center", fontFamily: FONT.mono, fontSize: 11, color: t.text }}>{text && s.share >= 0.05 ? `${s.label} ${(s.share * 100).toFixed(0)}%` : ""}</div>
  ));
  return (
    <Frame id="weight-ribbon" title="Weight against target"
      right={<Segmented label="Group by" value={grp} onChange={setGroup} options={[{ value: "position", label: "Holding" }, { value: "class", label: "Class" }, { value: "sector", label: "Sector" }, { value: "currency", label: "Currency" }]} />}
      footer={<ProvenanceFooter source={source} asOf={asOf} basis={basis} coverage={coverage} />}>
      <StateView status={status} reason={reason} onRetry={refetch} height={80}>
        <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Current{total != null ? ` · ${Math.round(total).toLocaleString("en-GB")}` : ""}</div>
        <div style={{ display: "flex", paddingLeft: 1 }}>{bar(40, s => s.share, true)}</div>
        <div style={{ fontSize: 11, color: t.textMuted, margin: "10px 0 4px" }}>Target</div>
        {anyTarget
          ? <div style={{ display: "flex", paddingLeft: 1 }}>{bar(12, s => s.targetShare, false)}</div>
          : <div style={{ fontSize: 11, color: t.textFaint, border: `1px dashed ${t.borderStrong}`, padding: "4px 8px" }}>no targets set</div>}
      </StateView>
    </Frame>
  );
}
