import { useMemo } from "react";

export const Image = (
  props: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >,
) => {
  let srcSet;

  if (!props.src) {
    return <img {...props} />;
  }

  const url = useMemo(() => {
    if (!props.src) {
      return null;
    }
    try {
      const url = new URL(props.src);
      return url;
    } catch (e) {
      console.error("Error parsing URL", props.src);
      return null;
    }
  }, [props.src]);

  if (
    process.env.VERCEL &&
    url?.hostname === "cdn.zuplo.com" &&
    !props.srcSet &&
    !props.src.endsWith(".svg") &&
    !props.src.endsWith(".gif")
  ) {
    try {
      const path = /^https?:/.test(props.src) ? url?.pathname : props.src;

      srcSet = [
        `https://cdn.zuplo.com/cdn-cgi/image/fit=contain,width=640,format=auto${path}   640w`,
        `https://cdn.zuplo.com/cdn-cgi/image/fit=contain,width=960,format=auto${path}   960w`,
        `https://cdn.zuplo.com/cdn-cgi/image/fit=contain,width=1280,format=auto${path} 1280w`,
        `https://cdn.zuplo.com/cdn-cgi/image/fit=contain,width=2560,format=auto${path} 2560w`,
      ].join(", ");
    } catch (e) {
      console.error("Error parsing URL", props.src);
    }
  }

  return <img {...props} srcSet={srcSet} />;
};
