# Graph Report - Meridian-Primary  (2026-10-12)

## Corpus Check
- 174 files · ~417,218 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 10, .db-wal 2, .db 1)

## Summary
- 1935 nodes · 5861 edges · 79 communities (70 shown, 9 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 121 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Shared UI & Theme
- Analytics & Optimiser
- App.jsx Research & AI
- Project Docs & Checklists
- Theme & Portfolio Pages
- Bull/Bear, Yahoo, Classify
- Page Hooks & Specs
- EDGAR, Mandate & Goal Tests
- Panels & Research Tab
- Signals & DB Helpers
- API Server, DB & FT
- Overview Engine & Contract
- Rebuild Tests & RNG
- Correlation Engine
- Series Tests
- Series & Performance Engine
- Overview Registry & Hooks
- Memory, Paper & DB Reads
- Composition & X-ray
- Endpoints & API Client
- Reports & News Pages
- Bars, Research & Trading Days
- News Feed, Scoring & AI
- Overnight Briefs
- Attribution Tests
- Community 25: performance.js / attribution.js / listFl
- Community 26: pages.jsx / analysis/registry.js / regis
- Community 27: test-signals.mjs / reset() / story()
- Community 28: server/config.js / universe.js / sync.js
- Community 29: test-composition.mjs / labelCheck() / no
- Community 30: reports.js / db / test-reports.mjs
- Community 31: MarketsPage() / DetailStrip() / Performa
- Community 32: importer.js / preview() / test-importer.
- Community 33: portfolio.js / analyst.js / valuePortfol
- Community 34: TradingTerminalInner() / WhatChangedPage
- Community 35: layout.jsx / Gallery.jsx / SubPage.jsx
- Community 36: test-briefing.mjs / a / after
- Community 37: useHoldings.js / enrichedSpec() / useRib
- Community 38: news.js / refreshNews() / searchLiveNews
- Community 39: test-performance.mjs / clearFlows() / da
- Community 40: NoData() / CorrelationReportPanel / Attr
- Community 41: test-lookthrough.mjs / fs / blind
- Community 42: rebuild/index.js / stress.js / runAllSce
- Community 43: briefing.js / buildBriefing() / fingerpr
- Community 44: exposure.js / pairOverlap() / returnCorr
- Community 45: package.json / vite.config.js / engines
- Community 46: test-portfolio-analysi / check() / corr
- Community 47: allocate.js / screener.js / scoreSymbol(
- Community 48: portfolio-analysis.js / holdingDetail() 
- Community 49: construct.js / construct() / applyConstr
- Community 50: dataVersion.js / useApi.js / api.js
- Community 51: test-contract.mjs / ref_path / start.js
- Community 52: test-xray.mjs / BOOK / byName
- Community 53: analysis.js / scenarioLab() / instrument
- Community 54: diligence.js / componentScores() / asses
- Community 55: seed-world.mjs / gauss() / makeBars()
- Community 56: ref_fs / ui-check.mjs / ui-poll-check.mj
- Community 57: funds.js / fetchBlackRockNAV() / fetchFi
- Community 58: Fable Overview Top (Po / Growth of the b
- Community 59: Fable Overview 2 (midd / 04 Composition 
- Community 60: holdings-data.js / holdingReturns() / en
- Community 61: scripts / build / dev
- Community 62: seed-dev-db.js / gauss() / market
- Community 63: Fable Overview 3: Posi / Top Positions T
- Community 64: 07 Relevant developmen / Fable overview 
- Community 65: RebuildErrorBoundary / RebuildCrashPanel
- Community 66: dependencies / react / react-dom
- Community 67: devDependencies / vite / vite-plugin-pwa
- Community 68: getNews() / rankScore() / heuristicRelev
- Community 69: Meridian brand mark (t / icon-192.png: t
- Community 70: lint-colours.mjs / walk() / FILES
- Community 71: ui-interact-analysis.m / check() / mcReq
- Community 72: auto-update.ps1 / Log() / Restart-Meridi
- Community 73: ui-interact-holdings.m / check() / delet
- Community 74: ui-gallery-check.mjs / errors

## God Nodes (most connected - your core abstractions)
1. `useT()` - 128 edges
2. `all()` - 86 edges
3. `run()` - 81 edges
4. `useTheme()` - 75 edges
5. `ProvenanceFooter()` - 68 edges
6. `Panel()` - 66 edges
7. `StateView()` - 66 edges
8. `getBars()` - 65 edges
9. `StaleBadge()` - 65 edges
10. `Frame()` - 65 edges

## Surprising Connections (you probably didn't know these)
- `addHolding()` --calls--> `run()`  [EXTRACTED]
  scripts/test-attribution.mjs → server/db.js
- `add()` --calls--> `run()`  [EXTRACTED]
  scripts/test-composition.mjs → server/db.js
- `clearFlows()` --calls--> `run()`  [EXTRACTED]
  scripts/test-performance.mjs → server/db.js
- `hold()` --calls--> `run()`  [EXTRACTED]
  scripts/test-series.mjs → server/db.js
- `reset()` --calls--> `run()`  [EXTRACTED]
  scripts/test-signals.mjs → server/db.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Orientation and reference documents for new sessions** — claude, readme, project_state [EXTRACTED 0.95]
- **Portfolio UI build plan to execution to report** — ui_build_checklist, portfolio_component_checklist, overnight_brief, run_log, morning_report [INFERRED 0.85]
- **No-fabrication and honest-refusal principle across docs** — claude_working_conventions, project_state_design_principles, readme_honest_principles, ui_build_checklist_rejected_components [INFERRED 0.85]
- **Overnight Portfolio build brief set** — docs_overnight_briefs_brief_master_master_brief, docs_overnight_briefs_brief_run1_backend_run1_brief, docs_overnight_briefs_brief_run2_overview_ui_run2_brief, docs_overnight_layout_spec_fable_layout_spec, docs_overnight_overview_meridian_overview_job_specs [EXTRACTED 1.00]
- **Performance block: chart, period returns, benchmark comparison** — docs_overnight_reference_fable_overview_1_top_growth_chart, docs_overnight_reference_fable_overview_1_top_period_returns, docs_overnight_reference_fable_overview_1_top_kpi_strip [INFERRED 0.75]
- **Numbered overview dashboard sections** — docs_overnight_reference_fable_overview_2_middle_leaders_laggards, docs_overnight_reference_fable_overview_2_middle_todays_contribution, docs_overnight_reference_fable_overview_2_middle_allocation_at_a_glance, docs_overnight_reference_fable_overview_2_middle_top_of_the_book, docs_overnight_reference_fable_overview_2_middle_dates_in_view [EXTRACTED 0.95]
- **Overview sections tied to the user's holdings** — docs_overnight_reference_fable_overview_3_positions_calendar_positions_table, docs_overnight_reference_fable_overview_3_positions_calendar_catalyst_calendar, docs_overnight_reference_fable_overview_3_positions_calendar_relevant_developments [INFERRED 0.75]
- **News headline row composition** — docs_overnight_reference_fable_overview_4_news_relevant_developments, docs_overnight_reference_fable_overview_4_news_holding_chips, docs_overnight_reference_fable_overview_4_news_of_book_touched [INFERRED 0.85]

## Communities (79 total, 9 thin omitted)

### Community 0 - "Shared UI & Theme"
Cohesion: 0.08
Nodes (163): react, AllocationView(), CorrelationView(), CrisisReplayView(), MonteCarloView(), OverlapView(), RebalanceView(), RiskContributionView() (+155 more)

### Community 1 - "Analytics & Optimiser"
Cohesion: 0.07
Nodes (61): annualisedVol(), atr(), averageCorrelation(), betaAlpha(), bollinger(), cagr(), calmar(), captureRatios() (+53 more)

### Community 2 - "App.jsx Research & AI"
Cohesion: 0.04
Nodes (65): ALL_MARKET_SYMBOLS, ALL_SYMBOLS, anInstrumentLabel(), AXIS_ORDER, axisPrice(), BB, bbAge(), BRIEF_KIND_LABEL (+57 more)

### Community 3 - "Project Docs & Checklists"
Cohesion: 0.05
Nodes (69): CLAUDE.md (orientation for Claude), Windows auto-update system (scripts/windows), meridian.db (untouchable user data), Testing discipline (verify on real interpreter), The user (non-developer, GitHub plus PowerShell), Working conventions (no fabricated data, sourced figures), MORNING-REPORT.md (build status), Component status table (Overview/Holdings/Performance) (+61 more)

### Community 4 - "Theme & Portfolio Pages"
Cohesion: 0.07
Nodes (55): ActionTable(), AddHoldingForm(), submit(), AllocatePage(), generate(), AllocationRow(), AxisList(), BreakdownPanel() (+47 more)

### Community 5 - "Bull/Bear, Yahoo, Classify"
Cohesion: 0.08
Nodes (54): barCoverage(), analystChangeSignal(), analystRatingSignal(), analystTargetSignal(), anInstrument(), asStrings(), buildPrompt(), buildSignals() (+46 more)

### Community 6 - "Page Hooks & Specs"
Cohesion: 0.07
Nodes (50): allocationSpec, BOOK, correlationSpec, monteCarloSpec, overlapSpec, rebalanceSpec, riskSpec, scenariosSpec (+42 more)

### Community 7 - "EDGAR, Mandate & Goal Tests"
Cohesion: 0.07
Nodes (45): asked, bad, cache, cal, ev, ev2, flat, none (+37 more)

### Community 8 - "Panels & Research Tab"
Cohesion: 0.10
Nodes (47): absPctStr(), BackupPanel(), ChangelogPanel(), CompareChart(), ConsensusPanel(), DataHealthPanel(), dirColor(), DividendHistoryPanel() (+39 more)

### Community 9 - "Signals & DB Helpers"
Cohesion: 0.08
Nodes (40): /Users/hugodyson/Meridian-Primary-backup/server/engines/portfolio.js, after, dn, hold(), prices, reset(), up, v (+32 more)

### Community 10 - "API Server, DB & FT"
Cohesion: 0.08
Nodes (35): allStoredSymbols(), getFundNav(), insBar, insTick, purgeBars(), recordTicks(), saveBars(), saveFundNav() (+27 more)

### Community 11 - "Overview Engine & Contract"
Cohesion: 0.16
Nodes (35): BENCHMARKS, GBP_BENCHMARK, getSnapshots(), monteCarloView(), riskView(), scorecardView(), bookCalendar(), briefingDigest() (+27 more)

### Community 12 - "Rebuild Tests & RNG"
Cohesion: 0.05
Nodes (29): byAction, byCandidate, capped, dates, droppedSymbols, failures, holdings, impossible (+21 more)

### Community 13 - "Correlation Engine"
Cohesion: 0.10
Nodes (28): failures, xs, alignedReturns(), closeMap(), closeOf(), CLUSTER_CUT, clusters(), correlationReport() (+20 more)

### Community 14 - "Series Tests"
Cohesion: 0.06
Nodes (29): aug, augC, bClose, br, cal, cap, capDates, capShort (+21 more)

### Community 15 - "Series & Performance Engine"
Cohesion: 0.17
Nodes (31): benchmarkInfo(), benchmarkMap(), benchReturnBetween(), calendarReturns(), captureStats(), closeOnOrBefore(), coverageFor(), downsample() (+23 more)

### Community 16 - "Overview Registry & Hooks"
Cohesion: 0.14
Nodes (25): useHoldingsTable(), useTargets(), accountsSpec, cashSpec, concentrationSpec, goalSpec, useAccounts(), useCash() (+17 more)

### Community 17 - "Memory, Paper & DB Reads"
Cohesion: 0.12
Nodes (28): all(), averagePairCorrelation(), insObs, latestDate(), leadership(), memoryStats(), observeSymbol(), percentileOf() (+20 more)

### Community 18 - "Composition & X-ray"
Cohesion: 0.14
Nodes (27): overlapView(), clean(), compositionTree(), countIn(), groupsFor(), LENSES, SYNONYMS, decomposePosition() (+19 more)

### Community 19 - "Endpoints & API Client"
Cohesion: 0.11
Nodes (21): file, out, REFUSAL_PATHS, WORLDS, one(), geoSpec, blockSpec(), simple() (+13 more)

### Community 20 - "Reports & News Pages"
Cohesion: 0.11
Nodes (26): AlertButton(), AlertRow(), AlertsPage(), create(), onAction(), CompositionDonut(), CorrelationPanel(), NewsPage() (+18 more)

### Community 21 - "Bars, Research & Trading Days"
Cohesion: 0.19
Nodes (25): TRADING_DAYS, getBars(), backtest(), defaultGrid(), signalsFor(), STRATEGIES, verdict(), walkForward() (+17 more)

### Community 22 - "News Feed, Scoring & AI"
Cohesion: 0.13
Nodes (24): bookNews(), direction(), MACRO_NOTICE, BATCH_SIZE, buildPrompt(), bumpAttempts(), CATEGORIES, clamp() (+16 more)

### Community 23 - "Overnight Briefs"
Cohesion: 0.09
Nodes (26): Master Brief: build Portfolio page unattended, Stop rules and morning deliverable, Tier 1: 49 components, 605 jobs, R1-01 Headline understates unpriced holding, R1-02 Day change formula fix, R1-05 Portfolio vs benchmark series, R1-06 Period returns endpoint, R1-10 One-call Overview and data version (+18 more)

### Community 24 - "Attribution Tests"
Cohesion: 0.08
Nodes (18): addHolding(), bench, dates, dec, dec2, facts, failures, groups (+10 more)

### Community 25 - "Community 25: performance.js / attribution.js / listFl"
Cohesion: 0.16
Nodes (24): attributionReport(), byGroup(), carinoFactor(), carinoWeights(), commentaryFacts(), commentaryPrompt(), decompose(), explain() (+16 more)

### Community 26 - "Community 26: pages.jsx / analysis/registry.js / regis"
Cohesion: 0.12
Nodes (16): analysisRegistry, holdingsRegistry, healthSpec, useHealthAxes(), overviewRegistry, ANALYSIS_LAYOUTS, AnalysisPage(), HOLDINGS_LAYOUTS (+8 more)

### Community 27 - "Community 27: test-signals.mjs / reset() / story()"
Cohesion: 0.08
Nodes (20): always, conc, d, daily, described, failures, high, hist (+12 more)

### Community 28 - "Community 28: server/config.js / universe.js / sync.js"
Cohesion: 0.11
Nodes (20): held, symbols, t0, watched, CADENCE, CGT_ALLOWANCE, CGT_RATE_BASIC, CGT_RATE_HIGHER (+12 more)

### Community 29 - "Community 29: test-composition.mjs / labelCheck() / no"
Cohesion: 0.09
Nodes (17): add(), allU, before, cc, cc2, cr, lc, none (+9 more)

### Community 30 - "Community 30: reports.js / db / test-reports.mjs"
Cohesion: 0.13
Nodes (19): failures, goodEngines, db, assemble(), deleteReport(), esc(), generateDue(), getReport() (+11 more)

### Community 31 - "Community 31: MarketsPage() / DetailStrip() / Performa"
Cohesion: 0.16
Nodes (24): BoardHeading(), currencyStrength(), DetailStrip(), DivergingBar(), DollarCorrelationPanel(), Empty(), grid(), heatStyle() (+16 more)

### Community 32 - "Community 32: importer.js / preview() / test-importer."
Cohesion: 0.14
Nodes (18): failures, HOLDINGS_CSV, cleanSymbol(), detectDateOrder(), findHeaderRow(), HEADER_PATTERNS, KNOWN_WRAPPERS, mapColumns() (+10 more)

### Community 33 - "Community 33: portfolio.js / analyst.js / valuePortfol"
Cohesion: 0.18
Nodes (20): BENCHMARK, saveSnapshot(), listAlerts(), buildBrief(), computeRegime(), correlationWatch(), riskProfile(), buildHistorySeries() (+12 more)

### Community 34 - "Community 34: TradingTerminalInner() / WhatChangedPage"
Cohesion: 0.13
Nodes (23): ageLabel(), ChangeRow(), CommandPalette(), compositeColor(), FearGreedGauge(), fetchSessionRead(), Gallery, ordinal() (+15 more)

### Community 35 - "Community 35: layout.jsx / Gallery.jsx / SubPage.jsx"
Cohesion: 0.15
Nodes (17): Cell(), EXTRAS, Gallery(), REFUSAL_SWAP, resultsFor(), stateProps(), STATES, Bound() (+9 more)

### Community 36 - "Community 36: test-briefing.mjs / a / after"
Cohesion: 0.09
Nodes (19): a, after, alertSection, b, base, before, degraded, empty (+11 more)

### Community 37 - "Community 37: useHoldings.js / enrichedSpec() / useRib"
Cohesion: 0.10
Nodes (21): ENR_DEPS, enrichedSpec(), filtersSpec, inspectorSpec, keyInfoSpec, rangeSpec, ribbonGroup(), ribbonSpec (+13 more)

### Community 38 - "Community 38: news.js / refreshNews() / searchLiveNews"
Cohesion: 0.15
Nodes (19): RSS_FEEDS, DUP_STOPWORDS, escapeRegex(), FEED_WEIGHTS, fetchText(), NAME_HINTS, NEG, NEGATORS (+11 more)

### Community 39 - "Community 39: test-performance.mjs / clearFlows() / da"
Cohesion: 0.10
Nodes (17): added, after, before, clearFlows(), d, daysAgo(), failures, iso() (+9 more)

### Community 40 - "Community 40: NoData() / CorrelationReportPanel / Attr"
Cohesion: 0.17
Nodes (20): AttributionPanel(), ClusterBlocs(), ContributionRows(), corrColor(), CorrelationHeatmap(), CorrelationReportPanel(), EffectiveBetsDial(), GaugeBar() (+12 more)

### Community 41 - "Community 41: test-lookthrough.mjs / fs / blind"
Cohesion: 0.11
Nodes (14): blind, blindExposure, code, comps, d, exposure, failures, halfAndHalf (+6 more)

### Community 42 - "Community 42: rebuild/index.js / stress.js / runAllSce"
Cohesion: 0.18
Nodes (16): FACTORS, SCENARIOS, toReturns(), collectGaps(), getRun(), listRuns(), runRebuild(), saveRun() (+8 more)

### Community 43 - "Community 43: briefing.js / buildBriefing() / fingerpr"
Cohesion: 0.30
Nodes (18): buildBriefing(), buildVerdict(), clearReadHistory(), correlationBreaks(), fingerprint(), KIND_WEIGHT, lastRead(), markRead() (+10 more)

### Community 44 - "Community 44: exposure.js / pairOverlap() / returnCorr"
Cohesion: 0.19
Nodes (18): compositionFromSummary(), explainPair(), holdingsOverlap(), lookThroughNames(), lookThroughSectors(), normaliseName(), numeric(), pairKey() (+10 more)

### Community 45 - "Community 45: package.json / vite.config.js / engines"
Cohesion: 0.13
Nodes (14): engines, node, name, private, type, version, react-dom, recharts (+6 more)

### Community 46 - "Community 46: test-portfolio-analysi / check() / corr"
Cohesion: 0.12
Nodes (14): corr, cost, detail, fail, junk, junkPull, mandate, missing (+6 more)

### Community 47 - "Community 47: allocate.js / screener.js / scoreSymbol("
Cohesion: 0.22
Nodes (14): assembleCandidates(), explainCandidate(), generatePlan(), listPlans(), optimiserSecondOpinion(), PRECEDENT_MIN_BARS, savePlan(), scoreCandidate() (+6 more)

### Community 48 - "Community 48: portfolio-analysis.js / holdingDetail() "
Cohesion: 0.22
Nodes (12): AXIS_DESCRIPTIONS, AXIS_LABELS, buildAxis(), cachedComponents(), componentCache, holdingDetail(), holdingsByType(), instrumentTypeLabel() (+4 more)

### Community 49 - "Community 49: construct.js / construct() / applyConstr"
Cohesion: 0.29
Nodes (13): applyConstraints(), buildActions(), buildDropReason(), compareRisk(), construct(), expectedReturnsFromConviction(), feasibleInvested(), findBreaches() (+5 more)

### Community 50 - "Community 50: dataVersion.js / useApi.js / api.js"
Cohesion: 0.25
Nodes (9): getJson(), inflight, poll(), subs, subscribe(), useVersionKey(), EMPTY, envelopeToState() (+1 more)

### Community 51 - "Community 51: test-contract.mjs / ref_path / start.js"
Cohesion: 0.19
Nodes (5): launch(), procs, shutdown(), ROOT, WORLDS

### Community 52 - "Community 52: test-xray.mjs / BOOK / byName"
Cohesion: 0.15
Nodes (9): BOOK, byName, conc, exp, failures, overlaps, sec, secBy (+1 more)

### Community 53 - "Community 53: analysis.js / scenarioLab() / instrument"
Cohesion: 0.28
Nodes (12): correlationView(), customShock(), parse(), proxyRecovery(), rebalanceView(), scenarioLab(), scenarioPath(), instrumentLabel() (+4 more)

### Community 54 - "Community 54: diligence.js / componentScores() / asses"
Cohesion: 0.33
Nodes (12): assess(), clamp01(), componentScores(), corroboration(), costComponent(), decide(), _internal, newsGate() (+4 more)

### Community 55 - "Community 55: seed-world.mjs / gauss() / makeBars()"
Cohesion: 0.21
Nodes (9): BOOK, dates, gauss(), lastClose, makeBars(), market, marketRand, NOW (+1 more)

### Community 56 - "Community 56: ref_fs / ui-check.mjs / ui-poll-check.mj"
Cohesion: 0.20
Nodes (6): PORT, results, themes, worlds, original, requested

### Community 57 - "Community 57: funds.js / fetchBlackRockNAV() / fetchFi"
Cohesion: 0.29
Nodes (6): fetchBlackRockNAV(), fetchFidelityNAV(), fetchText(), MANUAL_FUNDS, parseBlackRockRow(), parseFidelityPage()

### Community 58 - "Community 58: Fable Overview Top (Po / Growth of the b"
Cohesion: 0.25
Nodes (7): Fable Overview Top (Portfolio Overview screenshot), Growth of the book against S&P 500 chart, Headline KPI Strip (Total Value, Return, Net Gain, YTD, Income, Cash, Risk), Period Returns Row (1M to MAX) with benchmark deltas, Portfolio Health Card (B+ grade), Market Ticker Bar, Top Navigation (Portfolio, Markets, News, Screener, Watchlists, Journal)

### Community 59 - "Community 59: Fable Overview 2 (midd / 04 Composition "
Cohesion: 0.32
Nodes (7): Fable Overview 2 (middle) dashboard screenshot, 04 Composition - Allocation at a glance (sunburst/treemap), 06 Next 30 days - Dates worth keeping in view, 02 Movers - Leaders & laggards, Period returns strip vs S&P 500, 03 What moved today - Today's contribution, 05 Largest positions - Top of the book

### Community 60 - "Community 60: holdings-data.js / holdingReturns() / en"
Cohesion: 0.39
Nodes (7): enrichedHoldings(), holdingReturns(), parse(), range52(), RETURN_WINDOWS, latestFor(), reconstructHistoryByHolding()

### Community 61 - "Community 61: scripts / build / dev"
Cohesion: 0.29
Nodes (7): scripts, build, dev, preview, server, start, sync

### Community 62 - "Community 62: seed-dev-db.js / gauss() / market"
Cohesion: 0.33
Nodes (5): dates, gauss(), market, marketRand, symbols

### Community 63 - "Community 63: Fable Overview 3: Posi / Top Positions T"
Cohesion: 0.47
Nodes (5): Fable Overview 3: Positions, Calendar, Relevant Developments (screenshot), Upcoming Catalyst Calendar, Of-Book-Touched Exposure Meter, Top Positions Table (top 8 of 31), Relevant Developments (headlines touching your book)

### Community 64 - "Community 64: 07 Relevant developmen / Fable overview "
Cohesion: 0.40
Nodes (5): Fable overview 4 - news screenshot (Relevant developments), Design study footer (themes Paper/Ink, prices as-of), Holding weight chips per headline, Of book touched meter, 07 Relevant developments (Headlines touching your book)

### Community 66 - "Community 66: dependencies / react / react-dom"
Cohesion: 0.40
Nodes (5): dependencies, react, react-dom, recharts, yahoo-finance2

### Community 67 - "Community 67: devDependencies / vite / vite-plugin-pwa"
Cohesion: 0.40
Nodes (5): devDependencies, vite, vite-plugin-pwa, @vitejs/plugin-react, workbox-window

### Community 68 - "Community 68: getNews() / rankScore() / heuristicRelev"
Cohesion: 0.70
Nodes (5): feedWeight(), getNews(), heuristicRelevance(), rankScore(), safeParse()

### Community 69 - "Community 69: Meridian brand mark (t / icon-192.png: t"
Cohesion: 0.67
Nodes (4): favicon.svg: teal hexagon with line-chart zigzag on dark rounded square, icon-192.png: teal hexagon with line-chart zigzag and dot on near-black, icon-512.png: teal hexagon with line-chart zigzag and dot on near-black, Meridian brand mark (teal hexagon + price-line chart)

### Community 70 - "Community 70: lint-colours.mjs / walk() / FILES"
Cohesion: 0.67
Nodes (3): DIRS, FILES, walk()

## Knowledge Gaps
- **36 isolated node(s):** `workbox-window`, `/Users/hugodyson/Meridian-Primary-backup/server/engines/portfolio.js`, `The user (non-developer, GitHub plus PowerShell)`, `Reports (period-ended, table-driven schedule)`, `node:sqlite instead of better-sqlite3` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 606 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `yahoo-finance2` connect `Community 45: package.json / vite.config.js / engines` to `Bull/Bear, Yahoo, Classify`?**
  _High betweenness centrality (0.314) - this node is a cross-community bridge._
- **What connects `workbox-window`, `/Users/hugodyson/Meridian-Primary-backup/server/engines/portfolio.js`, `The user (non-developer, GitHub plus PowerShell)` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Shared UI & Theme` be split into smaller, more focused modules?**
  _Cohesion score 0.07852979274611399 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Shared UI & Theme` to `App.jsx Research & AI`, `Community 35: layout.jsx / Gallery.jsx / SubPage.jsx`, `Community 37: useHoldings.js / enrichedSpec() / useRib`, `Page Hooks & Specs`, `Community 45: package.json / vite.config.js / engines`, `Overview Registry & Hooks`, `Community 50: dataVersion.js / useApi.js / api.js`, `Endpoints & API Client`, `Community 26: pages.jsx / analysis/registry.js / regis`?**
  _High betweenness centrality (0.276) - this node is a cross-community bridge._
- **Should `Analytics & Optimiser` be split into smaller, more focused modules?**
  _Cohesion score 0.0684931506849315 - nodes in this community are weakly interconnected._
- **Why does `recharts` connect `Community 45: package.json / vite.config.js / engines` to `App.jsx Research & AI`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Should `App.jsx Research & AI` be split into smaller, more focused modules?**
  _Cohesion score 0.0358148893360161 - nodes in this community are weakly interconnected._