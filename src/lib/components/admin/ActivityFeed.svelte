<script lang="ts">
  export let items: Array<{
    id: number;
    action?: string;
    model_type?: string;
    model_name?: string;
    user_name?: string;
    created_at?: string
  }> = [];

  const fmt = (s?: string) => (s ? new Date(s).toLocaleString() : '');

  const getActionColor = (action?: string) => {
    if (!action) return 'text-admin-text';
    if (action === 'created') return 'text-green-600';
    if (action === 'updated') return 'text-blue-600';
    if (action === 'deleted') return 'text-red-600';
    return 'text-admin-text';
  };

  const getActionLabel = (action?: string) => {
    if (!action) return 'Activity';
    return action.charAt(0).toUpperCase() + action.slice(1);
  };
</script>

<ul class="space-y-3 text-sm text-admin-muted">
  {#if items.length === 0}
    <li>No recent activity</li>
  {:else}
    {#each items as it}
      <li class="rounded-lg border border-admin-border/70 bg-admin-bg px-3 py-2">
        <div class="flex items-center gap-2">
          <span class="font-medium {getActionColor(it.action)}">{getActionLabel(it.action)}</span>
          <span class="text-admin-muted">•</span>
          <span class="text-admin-text">{it.model_type || 'Item'}</span>
        </div>
        <div class="mt-1">
          {#if it.model_name}
            <span class="text-admin-text font-medium">{it.model_name}</span>
          {/if}
          {#if it.user_name}
            <span class="text-admin-muted text-xs"> by {it.user_name}</span>
          {/if}
        </div>
        <span class="block text-xs text-admin-muted mt-1">{fmt(it.created_at)}</span>
      </li>
    {/each}
  {/if}
</ul>
