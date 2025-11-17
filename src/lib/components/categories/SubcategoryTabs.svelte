<script lang="ts">
  interface Props {
    categorySlug: string;
    subcategories?: Array<{ id: number; name: string; slug: string }>;
    activeSub?: string;
  }

  let { categorySlug, subcategories = [], activeSub }: Props = $props();
</script>

<div class="overflow-x-auto">
  <div class="inline-flex gap-2">
    <a href={`/categories/${categorySlug}`} class={`px-4 py-2 rounded-full border ${!activeSub ? 'bg-brand-darkGreen text-white border-brand-darkGreen' : 'bg-white text-brand-richBlack border-admin-border'}`}>All</a>
    {#each subcategories as s}
      <a href={`/categories/${categorySlug}/${s.slug}`} class={`px-4 py-2 rounded-full border ${activeSub === s.slug ? 'bg-brand-darkGreen text-white border-brand-darkGreen' : 'bg-white text-brand-richBlack border-admin-border'}`}>{s.name}</a>
    {/each}
  </div>
  </div>

