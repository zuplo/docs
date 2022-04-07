export interface Article {
  slug: string[];
  title: string;
  subtitle?: string;
  lead?: string;
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  frontmatter: Record<string, any>;
}

export interface ReferencePageContent {
  slug: string;
  content: string;
  title?: string;
}

export interface ArticleScope {
  embed: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
