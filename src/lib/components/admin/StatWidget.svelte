<script lang="ts">
  export let label = 'Total Perks';
  export let value: number | string = 0;
  export let sublabel: string | null = null;
</script>

<div class="bg-white rounded-xl shadow-card p-5">
  <div class="text-sm text-admin-muted">{label}</div>
  <div class="mt-2 text-3xl font-semibold text-admin-text">{value}</div>
  {#if sublabel}
    <div class="mt-1 text-xs text-admin-muted">{sublabel}</div>
  {/if}
</div>

