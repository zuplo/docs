/// <reference types="zudoku/client" />

interface ImportMetaEnv {
  readonly USE_IMAGE_CDN: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}
