<script lang="ts">
  type Crumb = { label: string; href?: string };
  export let items: Crumb[] = [];
</script>

<nav class="text-sm text-gray-500" aria-label="Breadcrumb">
  <ol class="flex items-center flex-wrap gap-1">
    {#each items as item, i}
      {#if item.href && i < items.length - 1}
        <li><a href={item.href} class="hover:text-brand-richBlack">{item.label}</a></li>
        <li aria-hidden="true" class="px-1">/</li>
      {:else}
        <li class="text-brand-richBlack">{item.label}</li>
      {/if}
    {/each}
  </ol>
</nav>
