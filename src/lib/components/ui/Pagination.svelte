<script lang="ts">
  export let meta: { current_page: number; last_page: number } | null = null;
  export let current: Record<string, string> = {};
  export let basePath: string = '';

  function buildLink(page: number) {
    const p = new URLSearchParams(current);
    p.set('page', String(page));
    const qs = p.toString();
    return `${basePath}${qs ? `?${qs}` : ''}`;
  }

  function buildPages(currentPage: number, lastPage: number): Array<number | string> {
    const pages: Array<number | string> = [];
    if (lastPage <= 7) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(lastPage - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < lastPage - 2) pages.push('...');
    pages.push(lastPage);
    return pages;
  }
</script>

{#if meta}
  <div class="mt-6 flex items-center justify-between text-sm text-gray-500">
    <div>Page {meta.current_page} of {meta.last_page}</div>
    <div class="flex items-center gap-2">
      {#if meta.current_page > 1}
        <a class="underline" href={buildLink(meta.current_page - 1)}>Prev</a>
      {/if}
      {#each buildPages(meta.current_page, meta.last_page) as p}
        {#if typeof p === 'string'}
          <span class="px-2">{p}</span>
        {:else}
          {#if p === meta.current_page}
            <span class="px-3 py-1 rounded bg-brand-darkGreen text-white">{p}</span>
          {:else}
            <a class="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200" href={buildLink(p)}>{p}</a>
          {/if}
        {/if}
      {/each}
      {#if meta.current_page < meta.last_page}
        <a class="underline" href={buildLink(meta.current_page + 1)}>Next</a>
      {/if}
    </div>
  </div>
{/if}
