export interface SortOption {
  name: string;
  href: string;
  current: boolean;
}

export interface SortMenu {
  label: string;
  options: SortOption[];
}