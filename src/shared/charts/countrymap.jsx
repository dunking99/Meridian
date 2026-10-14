// Country-shaded world views: a draggable orthographic globe and a flat
// Natural Earth map. Both draw real country outlines (Natural Earth 1:110m via
// the world-atlas package, projected with d3-geo) and shade each country by
// its share of the book on one sequential scale. A country with no measured
// exposure is plain grey; nothing is ever drawn for a figure we do not have.
// Colours come only from theme tokens.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { geoOrthographic, geoNaturalEarth1, geoPath, geoGraticule10, geoCentroid, geoBounds, geoContains } from "d3-geo";
import { feature } from "topojson-client";
import topo from "world-atlas/countries-110m.json";
import { useT, FONT, soft } from "../theme.jsx";
import { useWidth } from "./core.jsx";
import { useReducedMotion } from "../ui.jsx";

const FEATURES = feature(topo, topo.objects.countries).features.filter(f => f.properties.name !== "Antarctica");
const BOUNDS = new Map(FEATURES.map(f => [f, geoBounds(f)]));
const GRATICULE = geoGraticule10();
const SPHERE = { type: "Sphere" };

/** Names the look-through engine uses, where Natural Earth spells them differently. */
const NE_NAME = { "United States": "United States of America" };
export const neName = n => NE_NAME[n] ?? n;

/** Countries too small for the 1:110m outlines: drawn as a marker at their position instead. */
export const SMALL = { "Hong Kong": [114.17, 22.32], Singapore: [103.82, 1.35] };

/** Where to face the globe for a country; the US centroid is dragged out to sea by Alaska and Hawaii. */
const CENTRE_OVERRIDE = { "United States of America": [-98, 39] };
const centreOf = name => {
  if (CENTRE_OVERRIDE[name]) return CENTRE_OVERRIDE[name];
  const f = FEATURES.find(x => x.properties.name === name);
  return f ? geoCentroid(f) : null;
};
export const centreOfCountry = n => SMALL[n] ?? centreOf(neName(n));

/** One sequential scale for both views; square-rooted so a 2% country is still visible beside a 70% one. */
export function shadeFor(t, share, max) {
  if (!(share > 0)) return `color-mix(in srgb, ${t.textFaint} 20%, ${t.surface})`;
  const s = Math.sqrt(share / (max || 1));
  return `color-mix(in srgb, ${t.info} ${(24 + 76 * s).toFixed(0)}%, ${t.surface})`;
}

function countryAt(proj, x, y) {
  const ll = proj.invert?.([x, y]);
  if (!ll || !Number.isFinite(ll[0])) return null;
  for (const f of FEATURES) {
    const [[w, s], [e, n]] = BOUNDS.get(f);
    if (ll[1] < s || ll[1] > n) continue;
    if (w <= e && (ll[0] < w || ll[0] > e)) continue;
    if (geoContains(f, ll)) return f.properties.name;
  }
  return null;
}

function Tip({ at, name, share, note, t }) {
  if (!name) return null;
  return (
    <div role="status" style={{ position: "absolute", left: at.x + 14, top: at.y + 10, zIndex: 5, pointerEvents: "none", background: t.surface, border: `1px solid ${t.borderStrong}`, borderRadius: 6, padding: "6px 10px", boxShadow: `0 6px 18px ${soft(t.appBg, 60)}` }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: t.text }}>{name}</div>
      <div style={{ fontFamily: FONT.mono, fontSize: 10.5, color: t.textSecondary, marginTop: 2 }}>{share > 0 ? `≥${(share * 100).toFixed(1)}% of the equity book` : "no measured exposure"}</div>
      {note && <div style={{ fontFamily: FONT.mono, fontSize: 10, color: t.textMuted, marginTop: 3, maxWidth: 220 }}>{note}</div>}
    </div>
  );
}

/** Flat map. shares { neCountryName: fraction }. */
export function CountryFlatMap({ shares = {}, smallShares = {}, notes = {}, focus, onHover, summary }) {
  const t = useT();
  const [ref, width] = useWidth();
  const [at, setAt] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(null);
  const max = Math.max(0, ...Object.values(shares), ...Object.values(smallShares));
  const w = Math.max(width, 320);
  const { paths, grat, h, proj } = useMemo(() => {
    const p = geoNaturalEarth1().fitWidth(w, SPHERE);
    const gp = geoPath(p);
    const hh = Math.ceil(gp.bounds(SPHERE)[1][1]);
    return { proj: p, h: hh, grat: gp(GRATICULE), paths: FEATURES.map(f => ({ name: f.properties.name, d: gp(f) })) };
  }, [w]);
  const active = hover ?? focus;
  const set = n => { setHover(n); onHover?.(n); };
  return (
    <div ref={ref} style={{ position: "relative" }}
      onMouseMove={e => { const b = e.currentTarget.getBoundingClientRect(); setAt({ x: Math.min(e.clientX - b.left, b.width - 240), y: e.clientY - b.top }); }}
      onMouseLeave={() => set(null)}>
      <svg width={w} height={h} role="img" aria-label={summary} style={{ display: "block" }}>
        <path d={grat} fill="none" stroke={t.border} strokeWidth={0.5} opacity={0.5} />
        {paths.map(p => (
          <path key={p.name} d={p.d} fill={shadeFor(t, shares[p.name], max)} stroke={active === p.name ? t.text : t.surface} strokeWidth={active === p.name ? 1.2 : 0.5}
            onMouseEnter={() => set(p.name)} />
        ))}
        {Object.entries(SMALL).filter(([n]) => smallShares[n] > 0).map(([n, ll]) => {
          const [x, y] = proj(ll);
          return <circle key={n} cx={x} cy={y} r={5} fill={shadeFor(t, smallShares[n], max)} stroke={active === n ? t.text : t.surface} strokeWidth={1.2} onMouseEnter={() => set(n)} />;
        })}
      </svg>
      <Tip at={at} name={hover} share={shares[hover] ?? smallShares[hover]} note={notes[hover]} t={t} />
    </div>
  );
}

/** Draggable globe. `face` = { lon, lat, nonce } turns it to a place when the nonce changes. */
export function CountryGlobe({ shares = {}, smallShares = {}, notes = {}, focus, onHover, face, size = 480, summary, autoSpin = true }) {
  const t = useT();
  const reduced = useReducedMotion();
  const canvas = useRef(null);
  const [at, setAt] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(null);
  const max = Math.max(0, ...Object.values(shares), ...Object.values(smallShares));
  const top = Object.entries(shares).sort((a, b) => b[1] - a[1])[0]?.[0];
  const rot = useRef(null);
  if (rot.current == null) { const c = (top && centreOf(top)) || [-20, 20]; rot.current = { lon: c[0], lat: Math.max(-35, Math.min(45, c[1] * 0.7)) }; }
  const target = useRef(null), drag = useRef(null), hoverRef = useRef(null), vel = useRef(0);
  const active = hover ?? focus;
  const R = size / 2 - 6;

  const proj = () => geoOrthographic().scale(R).translate([size / 2, size / 2]).rotate([-rot.current.lon, -rot.current.lat]).clipAngle(90).precision(0.6);

  const draw = () => {
    const cv = canvas.current; if (!cv?.getContext) return;
    const ctx = cv.getContext("2d"), dpr = window.devicePixelRatio || 1;
    cv.width = size * dpr; cv.height = size * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    const p = proj(), path = geoPath(p, ctx);
    const g = ctx.createRadialGradient(size / 2 - R * 0.3, size / 2 - R * 0.35, R * 0.15, size / 2, size / 2, R);
    g.addColorStop(0, t.surface); g.addColorStop(1, t.surfaceInset);
    ctx.beginPath(); path(SPHERE); ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); path(GRATICULE); ctx.lineWidth = 0.5; ctx.strokeStyle = t.border; ctx.globalAlpha = 0.55; ctx.stroke(); ctx.globalAlpha = 1;
    for (const f of FEATURES) {
      const n = f.properties.name;
      ctx.beginPath(); path(f);
      ctx.fillStyle = shadeFor(t, shares[n], max); ctx.fill();
      ctx.lineWidth = active === n ? 1.4 : 0.5; ctx.strokeStyle = active === n ? t.text : t.surface; ctx.stroke();
    }
    for (const [n, ll] of Object.entries(SMALL)) {
      if (!(smallShares[n] > 0)) continue;
      const q = p(ll); if (!q) continue;
      ctx.beginPath(); ctx.arc(q[0], q[1], 5, 0, Math.PI * 2); ctx.fillStyle = shadeFor(t, smallShares[n], max); ctx.fill();
      ctx.lineWidth = active === n ? 1.4 : 1; ctx.strokeStyle = active === n ? t.text : t.surface; ctx.stroke();
    }
    ctx.beginPath(); path(SPHERE); ctx.lineWidth = 1; ctx.strokeStyle = t.borderStrong; ctx.stroke();
  };

  useEffect(() => { draw(); });
  useEffect(() => { if (face?.lon != null) target.current = { lon: face.lon, lat: Math.max(-40, Math.min(50, face.lat * 0.8)) }; }, [face?.nonce]);  // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    let raf, last = performance.now();
    const step = now => {
      const dt = now - last; last = now;
      if (target.current && !drag.current) {
        const tg = target.current; let dl = tg.lon - rot.current.lon; dl = ((dl + 540) % 360) - 180;
        rot.current = { lon: rot.current.lon + dl * 0.14, lat: rot.current.lat + (tg.lat - rot.current.lat) * 0.14 };
        if (Math.abs(dl) < 0.15 && Math.abs(tg.lat - rot.current.lat) < 0.15) target.current = null;
        draw();
      } else if (!reduced && autoSpin && !drag.current && !hoverRef.current) {
        rot.current.lon += vel.current * dt + dt * 0.004; vel.current *= 0.95; draw();
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced, autoSpin, shares, smallShares, active, t, size]);  // eslint-disable-line react-hooks/exhaustive-deps

  const local = e => { const b = canvas.current.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; };
  const onKey = e => {
    const k = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, 8], ArrowDown: [0, -8] }[e.key];
    if (!k) return;
    e.preventDefault();
    rot.current = { lon: rot.current.lon + k[0], lat: Math.max(-70, Math.min(70, rot.current.lat + k[1])) };
    draw();
  };
  const setH = n => { hoverRef.current = n; setHover(n); onHover?.(n); };
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <canvas ref={canvas} width={size} height={size} tabIndex={0} role="img" aria-label={`${summary ?? "Globe"}. Arrow keys rotate.`}
        style={{ width: size, height: size, cursor: drag.current ? "grabbing" : hover ? "pointer" : "grab", display: "block", touchAction: "none" }}
        onKeyDown={onKey}
        onPointerDown={e => { target.current = null; drag.current = { ...local(e), lon: rot.current.lon, lat: rot.current.lat }; e.currentTarget.setPointerCapture?.(e.pointerId); }}
        onPointerMove={e => {
          const pt = local(e); setAt(pt);
          if (drag.current) {
            const before = rot.current.lon;
            rot.current = { lon: drag.current.lon - (pt.x - drag.current.x) * 0.45, lat: Math.max(-70, Math.min(70, drag.current.lat + (pt.y - drag.current.y) * 0.35)) };
            vel.current = (rot.current.lon - before) * 0.02; draw();
          } else {
            let n = countryAt(proj(), pt.x, pt.y);
            if (!n) for (const [sn, ll] of Object.entries(SMALL)) { const q = proj()(ll); if (q && Math.hypot(q[0] - pt.x, q[1] - pt.y) < 8) n = sn; }
            if (n !== hoverRef.current) setH(n);
          }
        }}
        onPointerUp={() => { drag.current = null; }}
        onPointerLeave={() => setH(null)} />
      <Tip at={{ x: Math.min(at.x, size - 240), y: at.y }} name={hover} share={shares[hover] ?? smallShares[hover]} note={notes[hover]} t={t} />
    </div>
  );
}
