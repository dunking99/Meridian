# Meridian codebase guide: what does what, and where to go for a given job

Written from reading the repo (README, CLAUDE.md, the Portfolio-page plumbing in
`src/` and `server/routes-overnight.js`, and file headers). Marked **[read]**
where I opened the code, **[docs]** where I am relying on README/PROJECT_STATE,
and **[not opened]** where I have only seen the filename.

---

## 1. The big picture

```
Yahoo / SEC / RSS / FT            (outside world, fetched by server/sources/*)
        |
        v
server/sources/*  ->  meridian.db (SQLite)  ->  server/engines/*  ->  server/index.js (+ routes-overnight.js)
                                                                            |  HTTP on :4001
                                                                            v
                                     src/shared/api.js -> useApi/useSpec -> hook -> View -> screen
```

Two halves, one direction of flow: **sources fetch -> db stores -> engines
compute -> routes serve -> hooks fetch -> views draw.** Almost every question
"where do I change X" is answered by asking which stage of that chain X lives in.

There are two generations of front end living side by side:

- **Old style: `src/App.jsx`** (594 KB, ~12,700 lines, one file). Contains the
  theme tokens, the nav, and the older pages (Research, Risk, News, Alerts,
  Screener, Rebuild, Settings...). Components, fetching and layout are all
  mixed in one file.
- **New style: the four Portfolio sub-pages** (Overview, Holdings, Performance,
  Analysis), split into `hook` + `View` + `registry` + `layout` files. This is
  where the overnight build went. **[read]**

---

## 2. Folder by folder

### Root files

| File | What it does |
|---|---|
| `CLAUDE.md` | Instructions for Claude sessions: user profile, branch rules, testing rules. |
| `README.md` | Architecture and engine write-ups, endpoint list. Long, good for the *why*. [docs] |
| `PROJECT_STATE.md` | Fuller reference: tables, 98 routes, pages, design principles, history. [docs] |
| `UI-BUILD-CHECKLIST.md`, `PORTFOLIO-COMPONENT-CHECKLIST.md` | The spec for the Portfolio components. IDs like `OV-04`, `HD-12`, `PF-03`, `AN-xx` come from here. |
| `OVERNIGHT-BRIEF.md`, `MORNING-REPORT.md`, `RUN-LOG.md` | The unattended build's instructions, status table and evidence log. History, not live code. |
| `package.json`, `package-lock.json` | Dependencies and the `start` / `server` / `sync` / `dev` scripts. |
| `vite.config.js` | Frontend build/dev server config (cache in OS temp dir, PWA plugin, polling on Windows). **[read]** |
| `index.html` | Single HTML shell Vite loads. `src/main.jsx` mounts React into it. **[read]** |
| `meridian.db`, `-wal`, `-shm`, `*sync-conflict*` | The live database. **Should not be in git** (see earlier warning). |
| `make-spec-ui.ps1` | One-off generator that wrote `src/dev/*`. Leftover. **[read header]** |
| `blueprint.html`, `design-lab.html` | Standalone design/prototype pages, not part of the app. [not opened] |
| `*.docx` (4 files) | Design reference documents (image-heavy). Not code. |
| `context-*.xml`, `meridian-repo.xml` | Repomix dumps of the repo for feeding to AI tools. Generated; safe to delete/ignore. |
| `tree.txt`, `TREES.txt`, `FILE-TREE.txt` | Old tree, empty file, and the tree I generated. |
| `.repomixignore`, `.graphifyignore`, `.archlet/`, `.codegraph/`, `.impeccable/`, `graphify-out/` | Config and output of code-analysis tools. Not app code. |

### `server/` (the backend: Node, no framework)

| File | What it does |
|---|---|
| `index.js` (1,726 lines) | The HTTP server. A big `routes` object keyed like `'GET /prices'`. Also starts the background loops (price poll, news, snapshots, signals, daily sync). At line ~1599 it merges in `overnightRoutes(...)`. **[read]** |
| `routes-overnight.js` | The *newer* routes for the Portfolio pages (`/overview`, `/performance/*`, `/portfolio/*`, `/analysis/*`, `/goal`, `/calendar/book`...). Also decides which write bumps which **data-version part**. **[read]** |
| `config.js` | Port (4001), DB path (`MERIDIAN_DB` override), poll cadences, the symbol universe, benchmarks, scenarios, tax constants. **[read]** |
| `db.js` | Opens SQLite, creates the core tables (`ohlcv`, `holdings`, `cash`, `transactions`, `portfolio_snapshots`, `alerts`, `news`, `watchlist`, `settings`...) and query helpers. Engines create their own extra tables (`cash_flows`, `reports`, `bullbear_*`...). **[read]** |
| `sources/` | The only code that talks to the outside world. `yahoo.js` quotes and history; `edgar.js` SEC filings; `news.js` RSS; `ft.js` fund NAVs; `funds.js` fund composition; `feargreed.js`; `instruments.js` what kind of thing a ticker is; `ai.js` Gemini calls. |
| `engines/` | Pure-ish calculation modules that read the db and return numbers. See below. |

**`server/engines/`, grouped by job** (names [read], contents [docs]):

- *Plumbing:* `contract.js` is the `{available, reason, asOf, source, data}` response shape every new route returns (`ok()` / `refuse()` / `guard()`). **[read]**
- *Valuation and returns:* `portfolio.js`, `performance.js` (XIRR/TWR, cash-flow ledger), `series.js` (chart series, period returns, drawdowns, risk), `attribution.js`, `goal.js`.
- *Composition and look-through:* `composition.js`, `lookthrough.js`, `xray.js`, `holdings-data.js`, `profiles.js`.
- *Portfolio page feeds:* `overview.js` (builds the 17 blocks behind `/overview`), `analysis.js` (adapters for the Analysis tab), `book-feed.js` (calendar, news, briefing digest for the book). **[read overview.js header]**
- *Risk and planning:* `analytics.js`, `correlation.js`, `optimiser.js`, `montecarlo.js`, `stress.js`, `rebalance.js`, `allocate.js`, `rebuild/` (the "what should I own" pipeline).
- *Signals and monitoring:* `alerts.js`, `signals.js`, `briefing.js`, `memory.js`, `calendar.js`, `newsscore.js`.
- *Research:* `research.js`, `bullbear.js`, `screener.js`, `backtest.js`, `paper.js`, `analyst.js`.
- *Data hygiene:* `integrity.js`, `importer.js`, `reports.js`.

### `src/` (the frontend: React + Vite)

| Path | What it does |
|---|---|
| `main.jsx` | Mounts `<App/>`. **[read]** |
| `App.jsx` | Theme tokens (`THEMES` at line 178), sidebar nav, page switch (`activePage === "research"` etc., ~line 12632), the old pages, and the market-data polling. Renders the Portfolio sub-pages with its theme passed in. **[read parts]** |
| `config.js` | `API_BASE` (default `http://localhost:4001`, override with `VITE_MERIDIAN_API`) and Gemini model. **[read]** |
| `pages.jsx` | Wires each Portfolio sub-page: `OverviewPage`, `HoldingsPage`, `PerformancePage`, `AnalysisPage` = `SubPage` + that page's **layouts** + **registry**. **[read]** |
| `registry-all.js` | Combines the four registries so the gallery and spec page can list every component. **[read]** |
| `prices.js` | Price fetching helper for the older pages. [not opened] |
| `shared/` | The reusable toolkit for the new pages (below). |
| `overview/`, `holdings/`, `performance/`, `analysis/` | One folder per Portfolio sub-page, each with `hooks/`, `views/`, `layouts/`, `registry.js`. |
| `gallery/` | `#/gallery`: renders each component alone in six states from recorded API responses (`fixtures.json`). Dev tool. **[read]** |
| `dev/` | `SpecPage`/`SpecBox`/`SpecSlot`/`Placeholder`: the "specification sheet" showing every panel as a box. Dev scaffolding. **[read header]** |
| `lab/` | Ledger design prototypes B-F. Experiments. |

**`src/shared/`** (the toolkit) **[read]**

| File | Job |
|---|---|
| `endpoints.js` | **Every API path the Portfolio pages call**, as the `EP` object. Single place to see/add a path. Also lists which paths the gallery records. |
| `api.js` | `getJson(path)`: the fetch wrapper, de-duplicates identical simultaneous requests. |
| `dataVersion.js` | Polls `/data-version` every 10 s; panels refetch only when a part they depend on changes. |
| `useApi.js` | `useApi(path, {deps, staleAfterMs, adapt})`: fetch + loading/refused/error states + refetch on version change. Turns the server envelope into `{status, data, reason, asOf, source...}`. |
| `layout.jsx` | The layout engine: page context (selection, filters in the URL hash), `useSpec`, `LayoutPage` that renders a layout's rows by looking names up in a registry. |
| `SubPage.jsx` | Wraps a page in theme + page context + chosen layout; has the dev layout switcher. |
| `theme.jsx` | `useT()` returns colour tokens; `FONT`, `cat()`, `signColour()`, `soft()`, `mix()`. **No literal colours allowed in new code**. |
| `ui.jsx` | Shared UI: `Frame`, `StateView`, `ProvenanceFooter`, `Segmented`, `StaleBadge`, `Placeholder`, etc. |
| `charts/` | Hand-written SVG charts: `line.jsx`, `bars.jsx`, `shapes.jsx`, `geo.jsx`, `countrymap.jsx`, `core.jsx`. |
| `table.jsx`, `format.js` | Data table component; number/currency/percent formatters (`gbp`, `pct`...). |

### `scripts/`

| Script | Job |
|---|---|
| `start.js` | `npm start`: launches API and Vite together, cross-platform. |
| `sync.js` | `npm run sync`: backfills ~12 years of price history. |
| `seed-dev-db.js`, `seed-world.mjs` | Build **synthetic** databases (populated/thin/empty) for tests. Refuse to touch a real db. |
| `test-*.mjs` (16) | Engine tests with hand-worked answers. Run against a throwaway db: `MERIDIAN_DB=/tmp/x.db node scripts/test-xray.mjs`. |
| `ui-*.mjs` | Playwright checks of the UI (states, interactions, polling, gallery). |
| `record-gallery-fixtures.mjs` | Re-records `src/gallery/fixtures.json` from running test APIs. |
| `lint-colours.mjs` | Fails if a literal colour appears in new files. |
| `windows/*.ps1`, `run-hidden.vbs` | The Windows auto-update system (Task Scheduler). Edit with great care; ASCII only. |

---

## 3. How a Portfolio component is put together **[read]**

One component = four small pieces, joined in a registry:

```
registry.js   TopHoldings: { title, useData: useTopHoldings, View: TopHoldingsView, spec: topSpec }
hooks/        useTopHoldings.js   -> which endpoint, which data-version parts, how to reshape it
views/        TopHoldingsView.jsx -> pure drawing; receives {status, data, asOf, ...}, never fetches
layouts/      overview.v0-medium.js -> { component: "TopHoldings", span: 12, props: { n: 8 } }
```

The Overview hooks all read one backend route (`/overview?blocks=<name>`) through
`blockSpec()` in `overview/hooks/common.js`. Other pages call their own endpoints
listed in `shared/endpoints.js`.

---

## 4. Scenarios: "I want to... so which file?"

**A. Change how an existing component looks** (spacing, colours, chart type, columns)
-> its **View** file in `src/<page>/views/`. Example: Top holdings table =
`src/overview/views/TopHoldingsView.jsx`. Find the right file by looking the
component name up in `src/<page>/registry.js`. Colours must come from `useT()`.

**B. Change what a component shows** (a new column, a different figure)
-> two places: the **backend block** that produces the number (e.g. the `top`
block in `server/engines/overview.js`, or the engine it calls), then the **View**
to display it. If it only reshapes existing data, the **hook** (`select`) is enough.

**C. Wire live data into a chart / replace a placeholder with real data**
1. Does a route exist? Check `server/routes-overnight.js` and `server/index.js`.
2. If not: add the calculation to a file in `server/engines/`, return it with
   `ok(...)`/`refuse(...)` from `contract.js`, add a route line in
   `routes-overnight.js`.
3. Add the path to `src/shared/endpoints.js`.
4. Write/adjust the hook in `src/<page>/hooks/` using `useApi`/`useSpec`, declaring
   its `deps` (`prices`, `book`, `bars`, `news`, `calendar`, `flows`, `goal`, `watch`,
   `briefing`) so it auto-refreshes.
5. Feed the result to the View.
Missing data must render as visibly missing (`refuse` + `reason`), never fabricated.

**D. Move components around / change a page's arrangement**
-> the **layout** file, e.g. `src/overview/layouts/overview.v0-medium.js`. It is
plain data (rows, spans, props). A new arrangement = a new layout file plus one
line in `src/pages.jsx`.

**E. Add a brand-new component to a Portfolio sub-page**
-> new hook + new View + one entry in that page's `registry.js` + a slot in a
layout. Optionally add its endpoints to `FIXTURE_PATHS` so the gallery can show it.

**F. Add a new sidebar page**
-> `src/App.jsx`: add a nav item, add an `activePage === "yourpage"` render block
near line 12632, write the page component in that file (or in a new folder and
import it, which is the cleaner way).

**G. Change colours / dark-light theme**
-> `THEMES` in `src/App.jsx` (line ~178). New code reads tokens via `useT()` in
`src/shared/theme.jsx`; never hard-code a colour.

**H. Change how a number is calculated** (returns, risk, correlation...)
-> the engine in `server/engines/` named in section 2, **and** its test in
`scripts/test-*.mjs`. Run the test against a throwaway db.

**I. Change where prices/news/filings come from, or add a data source**
-> `server/sources/` (one file per source), scheduled from `server/index.js`
(cadences in `server/config.js`), stored through `server/db.js`.

**J. Add a new database table or column**
-> core tables in `server/db.js`; engine-specific tables are created inside that
engine file. This is the risky one: the real db has no backup, and changing
existing tables means a migration. Always flag before doing it.

**K. Change how often things refresh**
-> server polls: `CADENCE` in `server/config.js`. Front end: `POLL_MS` in
`src/shared/dataVersion.js` and the price poll in `App.jsx`.

**L. Change the port or where the front end finds the API**
-> `server/config.js` (`PORT`) and `src/config.js` (`API_BASE`). Note
`scripts/windows/auto-update.ps1` still checks 3001 (see earlier notes).

**M. Change how the app updates itself on Windows**
-> `scripts/windows/` only. ASCII only, test with real `pwsh`, check
`$LASTEXITCODE`. Cannot be fully verified from a Linux sandbox.

**N. Add or change an alert type**
-> price/technical alerts: `server/engines/alerts.js`. Cross-engine ones
(news, bull/bear flips, concentration): `server/engines/signals.js`. Alerts page
UI is `AlertsPage` in `App.jsx`.

**O. Change AI commentary / prompts**
-> `server/sources/ai.js` (the call), and the engine that builds the prompt
(`attribution.js`, `analyst.js`, `bullbear.js`, `newsscore.js`). Keep the rule
that the prompt must allow "nothing notable happened".

**P. Import holdings from a broker statement**
-> `server/engines/importer.js` (parser, preview, apply) and the import routes in
`server/index.js`.

**Q. See a component without the whole app / debug a view**
-> `#/gallery` (`src/gallery/Gallery.jsx`), fed by `src/gallery/fixtures.json`.

**R. Tidy the repo / reduce size**
-> untrack `meridian.db*`, `context-*.xml`, `meridian-repo.xml`, `.docx`, `.DS_Store`
and add to `.gitignore`. Candidates for deletion after checking imports:
`src/lab/`, `src/dev/`, `public/portfolio-2/`, `make-spec-ui.ps1`, `tree.txt`,
`TREES.txt`, `server/routes-overnight.js` stays (it is imported).

---

## 5. Things to know before touching code

- `meridian.db` is real money data with no backup. Develop against
  `MERIDIAN_DB=/tmp/test.db` plus `scripts/seed-world.mjs`.
- Old pages are inside `App.jsx`; changing one means editing a huge file. Read
  only the function you need (function start lines can be found with grep).
- Server responses for the new pages always use the `ok/refuse` envelope; keep it.
- Not verified by me: the contents of most engines, most views, and `App.jsx`
  beyond its structure. Treat engine descriptions as README-level until opened.
