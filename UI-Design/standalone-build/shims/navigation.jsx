import { useEffect, useState, useContext, createContext } from "react";
export const ParamsContext = createContext({});
export class RedirectSignal { constructor(to) { this.to = to; } }
export class NotFoundSignal {}
export const currentPath = () => { const h = window.location.hash || ""; return h.startsWith("#/") ? h.slice(1).split("?")[0] || "/" : "/"; };
const go = (to, replace) => { const t = "#" + to; if (replace) window.history.replaceState(null, "", t); else window.location.hash = to; window.dispatchEvent(new HashChangeEvent("hashchange")); };
export function redirect(to) { throw new RedirectSignal(to); }
export const permanentRedirect = redirect;
export function notFound() { throw new NotFoundSignal(); }
export function usePathname() { const [p, setP] = useState(currentPath); useEffect(() => { const on = () => setP(currentPath()); window.addEventListener("hashchange", on); return () => window.removeEventListener("hashchange", on); }, []); return p; }
export function useRouter() { return { push: t => go(t), replace: t => go(t, true), back: () => window.history.back(), forward: () => window.history.forward(), refresh: () => {}, prefetch: () => {} }; }
export function useParams() { return useContext(ParamsContext); }
export function useSearchParams() { return new URLSearchParams((window.location.hash.split("?")[1]) || ""); }
export function useSelectedLayoutSegment() { return currentPath().split("/")[1] || null; }
export function useSelectedLayoutSegments() { return currentPath().split("/").filter(Boolean); }
