<script lang="ts">
  export let items: Array<{ id: number; lead_type?: string; name?: string; email?: string; perk_title?: string; created_at?: string }> = [];
  const fmt = (s?: string) => (s ? new Date(s).toLocaleString() : '');
  const label = (t?: string) => t ? t.replace(/_/g, ' ') : 'activity';
</script>

<div class="bg-white rounded-xl shadow-card p-5">
  <div class="font-semibold text-admin-text">Recent Activity</div>
  <ul class="mt-4 space-y-3 text-sm text-admin-muted">
    {#if items.length === 0}
      <li>No recent activity</li>
    {:else}
      {#each items as it}
        <li>
          <span class="text-admin-text capitalize">{label(it.lead_type)}</span>
          {#if it.name} from {it.name}{/if}
          {#if it.perk_title} • {it.perk_title}{/if}
          <span class="block text-xs text-admin-muted">{fmt(it.created_at)}</span>
        </li>
      {/each}
    {/if}
  </ul>
  
</div>
