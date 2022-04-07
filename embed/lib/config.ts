import fs from "node:fs/promises";
import path from "node:path";
import yaml from "yaml";
import env from "./env";

export interface LinkItem {
  title: string;
  url: string;
  children?: LinkItem[];
}

export interface Sidebar {
  articles: LinkItem[];
}

export interface LinkBoxItem {
  text: string;
  url: string;
  icon: string;
}

export interface LinkBoxesConfig {
  linkBoxes: Record<string, LinkBoxItem[]>;
}

export async function getArticlesMenu(): Promise<LinkItem[]> {
  const configPath = path.join(env.CONFIG_LOCATION, "sidebar.yaml");
  const configYaml = await fs.readFile(configPath, "utf-8");
  const { articles } = (await yaml.parse(configYaml)) as Sidebar;
  return articles;
}

export async function getLinkBoxConfig(): Promise<
  Record<string, LinkBoxItem[]>
> {
  const configPath = path.join(env.CONFIG_LOCATION, "link-boxes.yaml");
  const configYaml = await fs.readFile(configPath, "utf-8");
  const { linkBoxes } = (await yaml.parse(configYaml)) as LinkBoxesConfig;
  return linkBoxes;
}
