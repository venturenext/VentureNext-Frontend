<script>
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  export let data;
  const items = data.items || [];
  const norm = (r) => (r || '').toLowerCase().replace(/\s+/g, '').replace(/-/g, '').replace(/_/g, '');
  $: isSuper = norm($page.data?.user?.role) === 'superadmin';
</script>

<div class="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
  <h1 class="text-xl font-semibold text-brand-richBlack">Leads</h1>
  <form method="GET" class="flex-1 md:w-96">
    <label class="relative block">
      <span class="sr-only">Search</span>
      <span class="absolute inset-y-0 left-3 my-auto mt-3 text-gray-400">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
      </span>
      <input name="search" placeholder="Search leads" value={data?.query?.search}
             class="w-full pl-10 pr-3 py-2 rounded-lg border border-admin-border bg-white focus:outline-none focus:ring-2 focus:ring-admin-blue" />
    </label>
  </form>
</div>

  <div class="bg-white rounded-2xl shadow-card border border-admin-border">
    <div class="overflow-x-auto">
    <table class="min-w-full text-sm">
      <thead class="bg-admin-sidebar/80 text-admin-muted uppercase text-xs">
        <tr>
          <th class="text-left px-4 py-3">Name</th>
          <th class="text-left px-4 py-3">Email</th>
          <th class="text-left px-4 py-3">Type</th>
          <th class="text-left px-4 py-3">Perk</th>
          <th class="text-left px-4 py-3">Created</th>
          <th class="text-right px-4 py-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each items as it}
          <tr class="border-t border-admin-border hover:bg-admin-sidebar/50">
            <td class="px-4 py-2 text-admin-text">{it.name}</td>
            <td class="px-4 py-2">{it.email}</td>
            <td class="px-4 py-2 capitalize">{it.lead_type}</td>
            <td class="px-4 py-2">{it.perk?.title || it.perk_title}</td>
            <td class="px-4 py-2">{it.created_at?.slice(0, 19).replace('T',' ')}</td>
            <td class="px-4 py-2 text-right">
              {#if isSuper}
                <form method="POST" action="?/delete" use:enhance class="inline-block">
                  <input type="hidden" name="id" value={it.id} />
                  <button class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-admin-border bg-white text-red-600 hover:bg-red-50" title="Delete">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </form>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
<Pagination meta={data.meta} current={data.query} basePath="/admin/leads" />
