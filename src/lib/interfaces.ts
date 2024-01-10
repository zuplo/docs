export interface NavCategory {
  label: string;
  items: (NavCategory | NavItem)[];
}

export interface NavItem {
  label: string;
  href: string;
}
