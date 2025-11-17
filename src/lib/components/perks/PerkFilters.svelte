<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import type { Category } from '$lib/types/category';
  export let categories: Category[] = [];
  export let current: { category?: string; subcategory?: string; location?: string; search?: string; sort?: string } = {};
  export let basePath: string = '/perks';

  let selectedCategory = current.category || '';
  let selectedSubcategory = current.subcategory || '';
  let location = current.location || 'all';
  let search = current.search || '';
  let sort = (current.sort as string) || 'latest';

  // Keep local state in sync when `current` changes (e.g., after reset)
  $: if (current) {
    selectedCategory = current.category || '';
    selectedSubcategory = current.subcategory || '';
    location = current.location || 'all';
    search = current.search || '';
    sort = (current.sort as string) || 'latest';
  }

  $: subcategoryOptions = (categories.find(c => c.slug === selectedCategory)?.subcategories) || [];

  function buildUrl() {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedSubcategory) params.set('subcategory', selectedSubcategory);
    if (location && location !== 'all') params.set('location', location);
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);
    const qs = params.toString();
    return `${basePath}${qs ? `?${qs}` : ''}`;
  }

  function applyFilters() {
    goto(buildUrl(), { replaceState: true, keepFocus: true, noScroll: true });
  }

  function setCategory(slug: string) {
    selectedCategory = slug;
    selectedSubcategory = '';
    goto(buildUrl(), { replaceState: true, keepFocus: true, noScroll: true });
  }

  function setLocation(loc: string) {
    location = loc;
    goto(buildUrl(), { replaceState: true, keepFocus: true, noScroll: true });
  }

  function resetFilters() {
    goto('/perks', { replaceState: true, keepFocus: true, noScroll: true });
  }
</script>

<div class="rounded-2xl bg-gray-50 p-4">
  <div class="flex flex-wrap items-center gap-3">
    <button class="px-3 py-1 rounded-full border text-sm"
      class:bg-brand-darkGreen={selectedCategory === ''}
      class:text-white={selectedCategory === ''}
      class:border-brand-darkGreen={selectedCategory === ''}
      class:hover\:bg-gray-100={selectedCategory !== ''}
      on:click={() => setCategory('')}>
      All Categories
    </button>
    {#each categories as c}
      <button class="px-3 py-1 rounded-full border text-sm"
        aria-pressed={selectedCategory === c.slug}
        class:bg-brand-darkGreen={selectedCategory === c.slug}
        class:text-white={selectedCategory === c.slug}
        class:border-brand-darkGreen={selectedCategory === c.slug}
        class:hover\:bg-gray-100={selectedCategory !== c.slug}
        on:click={() => setCategory(c.slug)}>
        {c.name}
      </button>
    {/each}

    <span class="h-5 w-px bg-gray-300 mx-1" aria-hidden="true"></span>

    {#each [
      { label: 'All Locations', val: 'all' },
      { label: 'Malaysia', val: 'malaysia' },
      { label: 'Singapore', val: 'singapore' },
      { label: 'Global', val: 'global' }
    ] as loc}
      <button class="px-3 py-1 rounded-full border text-sm"
        aria-pressed={location === loc.val}
        class:bg-brand-darkGreen={location === loc.val}
        class:text-white={location === loc.val}
        class:border-brand-darkGreen={location === loc.val}
        class:hover\:bg-gray-100={location !== loc.val}
        on:click={() => setLocation(loc.val)}>
        {loc.label}
      </button>
    {/each}
  </div>
</div>
