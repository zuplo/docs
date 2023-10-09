declare module "remark-admonitions";
declare module "badwords-list";
declare module "simple-functional-loader";
import { type SearchOptions } from "flexsearch";

declare module "@/markdoc/search.mjs" {
  export type Result = {
    url: string;
    title: string;
    pageTitle?: string;
  };

  export function search(query: string, options?: SearchOptions): Array<Result>;
}
