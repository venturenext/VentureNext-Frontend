import { writable } from 'svelte/store';

export type SortBy = 'latest' | 'popular' | 'ending_soon';

export const filterStore = writable<{
  category: string | null;
  subcategory: string | null;
  location: 'malaysia' | 'singapore' | 'global' | 'all';
  search: string;
  sort: SortBy;
}>({
  category: null,
  subcategory: null,
  location: 'all',
  search: '',
  sort: 'latest'
});

