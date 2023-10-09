declare module "remark-admonitions";
declare module "badwords-list";
declare module "simple-functional-loader";
import { NavCategory } from "@/lib/interfaces";
import { type SearchOptions } from "flexsearch";

declare module "@/build/search.mjs" {
  export type Result = {
    url: string;
    title: string;
    pageTitle?: string;
  };

  export function search(query: string, options?: SearchOptions): Array<Result>;
}

declare module "@/build/navigation.mjs" {
  export const navigation: NavCategory[];
}
