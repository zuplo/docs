import { type SearchOptions } from "flexsearch";
import { NavCategory } from "./src/lib/interfaces";
declare module "@/markdoc/search.mjs" {
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
