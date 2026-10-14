import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import PortfolioApp from "@/components/portfolio-app";
const SECTIONS = ["holdings", "performance", "exposure", "plan", "activity"];
const read = () => { const m = /^#\/portfolio\/([a-z]+)/.exec(window.location.hash); return m && SECTIONS.includes(m[1]) ? m[1] : "overview"; };
function App() {
  const [s, setS] = useState(read);
  useEffect(() => { const on = () => { setS(read()); window.scrollTo(0, 0); }; window.addEventListener("hashchange", on); return () => window.removeEventListener("hashchange", on); }, []);
  return <PortfolioApp section={s} />;
}
createRoot(document.getElementById("root")).render(<App />);
