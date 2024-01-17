import { cp } from "fs/promises";
import path from "path";

await cp(
  path.join(process.cwd(), "node_modules", "shiki", "languages"),
  path.join(process.cwd(), "src", "shiki", "languages"),
  { recursive: true },
);
await cp(
  path.join(process.cwd(), "node_modules", "shiki", "themes"),
  path.join(process.cwd(), "src", "shiki", "themes"),
  { recursive: true },
);
