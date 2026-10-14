// Holdings layout v0: key info strip, ribbon, treemap, map, table, then the
// rest (per the master brief). Edit this data to rearrange the page.
export default {
  page: "holdings",
  name: "v0",
  note: "Order from the master brief: key info, ribbon, treemap + movers, filters, ledger, geography, then the rest.",
  maxWidth: 1240,
  rows: [
    { id: "H1", stretch: true, items: [
      { span: 8, stack: [{ component: "WeightRibbon", span: 8 }, { component: "PortfolioMap", span: 8 }] },
      { component: "MoversPanel", span: 4 },
    ] },
    { id: "H5", items: [{ component: "HoldingsFilters", span: 12 }] },
    { id: "H5f", items: [{ component: "LedgerPrototypeE", span: 12 }] },
    { id: "H5g", items: [{ component: "LedgerPrototypeF", span: 12 }] },
    { id: "H6", items: [{ component: "Ledger", span: 12 }] },
    { id: "H4", items: [{ component: "GeoExposure", span: 12 }] },
    { id: "H9", items: [{ component: "CashBreakdown", span: 6, props: { form: "tile" } }] },
  ],
};
