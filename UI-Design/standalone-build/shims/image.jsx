import React from "react";
export default function Image({ src, alt = "", width, height, fill, priority, quality, placeholder, blurDataURL, loader, unoptimized, style, ...rest }) {
  const s = typeof src === "object" && src ? src.src : src;
  return <img src={s} alt={alt} width={fill ? undefined : width} height={fill ? undefined : height} style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style } : style} {...rest} />;
}
