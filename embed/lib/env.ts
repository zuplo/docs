/* eslint-disable node/no-process-env */
import path from "node:path";

class Environment {
  public get QUICKSTARTS_LOCATION(): string {
    return path.join(this.DOCS_CONTENT_LOCATION, "/docs/");
  }

  public get CONFIG_LOCATION(): string {
    return path.join(this.DOCS_CONTENT_LOCATION, "/config/");
  }

  public get DOCS_CONTENT_LOCATION(): string {
    return process.env.VERCEL
      ? "/vercel/path0/_docs"
      : path.resolve(process.cwd(), "../");
  }

  public get REFERENCE_CONTENT_LOCATION(): string {
    return process.env.VERCEL
      ? "/vercel/path0/_reference"
      : path.resolve(process.cwd(), "_reference");
  }
}

const env = new Environment();
export default env;
