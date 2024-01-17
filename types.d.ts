import { NavCategory, Policy } from "./src/lib/interfaces";

declare module "@/build/navigation.mjs" {
  export const navigation: NavCategory[];
}

declare module "@/build/policies.mjs" {
  const namedExports: Record<string, Policy>;
  export = namedExports;
}
