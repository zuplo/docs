export const Image = (
  props: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >,
) => {
  let srcSet;

  if (
    process.env.VERCEL &&
    props.src &&
    props.src.startsWith("https://cdn.zuplo.com") &&
    !props.srcSet &&
    !props.src.endsWith(".svg") &&
    !props.src.endsWith(".gif")
  ) {
    try {
      const path = /^https?:/.test(props.src)
        ? new URL(props.src).pathname
        : props.src;

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
