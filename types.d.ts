import { NavItem, Policy } from "./src/lib/interfaces";

declare module "@/build/navigation.mjs" {
  export const navigation: NavItem[];
}

declare module "@/build/policies.mjs" {
  const namedExports: Record<string, Policy>;
  export = namedExports;
}
