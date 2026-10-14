import React from "react";
// Stand-in for next/link. Internal paths become hash routes so it works from file://.
export default function Link({ href, children, prefetch, replace, scroll, shallow, passHref, legacyBehavior, locale, ...rest }) {
  const raw = typeof href === "object" && href ? (href.pathname || "/") : String(href ?? "#");
  if (/^(https?:|mailto:|tel:)/.test(raw)) return <a href={raw} {...rest}>{children}</a>;
  if (raw.startsWith("/")) return <a href={"#" + raw} {...rest}>{children}</a>;
  return <a href="#" onClick={e => { e.preventDefault(); rest.onClick?.(e); }} {...rest}>{children}</a>;
}
