// Holdings components. Cash (HD-02) reuses the one cash hook/view (DUP rule).
import * as H from "./hooks/useHoldings.js";
import { KeyInfoView, UpDownView, WeightRibbonView, TreemapView, InspectorView } from "./views/HoldingsTop.jsx";
import { FiltersView, HoldingsTableView, WinnersView, Range52View, TargetsView, TrendView } from "./views/HoldingsMore.jsx";
import { LedgerPrototypeFView } from "../lab/LedgerPrototypeF.jsx";
import { LedgerPrototypeEView } from "../lab/LedgerPrototypeE.jsx";
import { LedgerPrototypeCView } from "../lab/LedgerPrototypeC.jsx";
import { LedgerPrototypeDView } from "../lab/LedgerPrototypeD.jsx";
import { LedgerPrototypeBView } from "../lab/LedgerPrototypeB.jsx";
import { LedgerPrototypeView } from "./views/LedgerPrototype.jsx";
import { WeightRibbonSchematic } from "./views/Schematic.jsx";
import { MoversView, MoversPanelView, LedgerView } from "./views/HoldingsMovers.jsx";
import { GeoCountryView } from "./views/HoldingsGeo.jsx";
import { useCash, cashSpec } from "../overview/hooks/useBookFacts.js";
import { CashView } from "../overview/views/BookFactsViews.jsx";

export const holdingsRegistry = {
  KeyInfoStrip: { checklist: "HD-04", title: "Key info strip", useData: H.useKeyInfo, View: KeyInfoView, spec: H.keyInfoSpec },
  UpDownRibbon: { checklist: "HD-22", title: "Up / down today", useData: H.useUpDown, View: UpDownView, spec: H.upDownSpec },
  WeightRibbon: { checklist: "HD-09", title: "Weight ribbon", useData: H.useRibbon, View: WeightRibbonSchematic /* was WeightRibbonView */, spec: H.ribbonSpec },
  PortfolioMap: { checklist: "HD-06", title: "Portfolio map / treemap", useData: H.useTreemap, View: TreemapView, spec: H.treemapSpec },
  PositionInspector: { checklist: "HD-20", title: "Position inspector", useData: H.useInspector, View: InspectorView, spec: H.inspectorSpec, gallery: { props: { symbol: "TWLD.L" } } },
  MoversPanel: { checklist: "HD-10", title: "Up/down and movers", useData: H.useMoversPanel, View: MoversPanelView, spec: H.moversSpec },
  LedgerPrototype: { checklist: "HD-01", title: "Ledger columns prototype", useData: () => ({}), View: LedgerPrototypeView, spec: H.tableSpec, galleryHidden: true },
  LedgerPrototypeB: { checklist: "HD-01", title: "Ledger columns prototype B", useData: () => ({}), View: LedgerPrototypeBView, spec: H.tableSpec, galleryHidden: true },
  LedgerPrototypeC: { checklist: "HD-01", title: "Ledger columns prototype C", useData: () => ({}), View: LedgerPrototypeCView, spec: H.tableSpec, galleryHidden: true },
  LedgerPrototypeD: { checklist: "HD-01", title: "Ledger columns prototype D", useData: () => ({}), View: LedgerPrototypeDView, spec: H.tableSpec, galleryHidden: true },
  LedgerPrototypeE: { checklist: "HD-01", title: "Ledger columns prototype E", useData: () => ({}), View: LedgerPrototypeEView, spec: H.tableSpec, galleryHidden: true },
  LedgerPrototypeF: { checklist: "HD-01", title: "Ledger columns prototype F", useData: () => ({}), View: LedgerPrototypeFView, spec: H.tableSpec, galleryHidden: true },
  Movers: { checklist: "HD-10", title: "Winners and losers", useData: H.useMovers, View: MoversView, spec: H.moversSpec },
  Ledger: { checklist: "HD-01", title: "Holdings ledger with inspector", useData: H.useLedger, View: LedgerView, spec: H.tableSpec, galleryHidden: true },
  GeoExposure: { checklist: "HD-07", title: "Geographic exposure", useData: H.useGeography, View: GeoCountryView, spec: H.geoSpec },
  HoldingsFilters: { checklist: "HD-05", title: "Filters / grouping", useData: H.useFilters, View: FiltersView, spec: H.filtersSpec },
  HoldingsTable: { checklist: "HD-01", title: "Full holdings table", useData: H.useHoldingsTable, View: HoldingsTableView, spec: H.tableSpec },
  WinnersLosers: { checklist: "HD-10", title: "Winners / losers", useData: H.useWinnersLosers, View: WinnersView, spec: H.winnersSpec },
  Range52: { checklist: "HD-11", title: "52-week range", useData: H.useRange52, View: Range52View, spec: H.rangeSpec },
  AllocationVsTarget: { checklist: "HD-12", title: "Allocation vs target", useData: H.useTargets, View: TargetsView, spec: H.targetsSpec },
  TrendColumn: { checklist: "HD-15", title: "Trend (30D / 3M)", useData: H.useTrend, View: TrendView, spec: H.trendSpec },
  CashBreakdown: { checklist: "HD-02", title: "Cash breakdown", useData: useCash, View: CashView, spec: cashSpec },
};
