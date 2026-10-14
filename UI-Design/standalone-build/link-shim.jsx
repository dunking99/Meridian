import React from "react";
// Stand-in for next/link: internal paths become hash routes so the file works from file://
export default function Link({ href, children, ...rest }) {
  const internal = typeof href === "string" && href.startsWith("/");
  const to = internal ? "#" + href : "#/portfolio";
  return <a href={internal ? to : "#"} onClick={internal ? undefined : e => e.preventDefault()} {...rest}>{children}</a>;
}
