<svelte:head>
  <title>Leads - Admin</title>
</svelte:head>

<script>
  import { page } from '$app/stores';
  import { goto, invalidateAll } from '$app/navigation';
  import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';

  export let data;
  $: items = data.items || [];
  const norm = (r) => (r || '').toLowerCase().replace(/\s+/g, '').replace(/-/g, '').replace(/_/g, '');
  $: isSuper = norm($page.data?.user?.role) === 'superadmin';

  let showDeleteConfirm = false;
  let leadToDelete = null;
  let isDeleting = false;

  function confirmDelete(lead) {
    leadToDelete = lead;
    showDeleteConfirm = true;
  }

  async function handleConfirmedDelete() {
    if (!leadToDelete) return;

    isDeleting = true;
    const formData = new FormData();
    formData.append('id', String(leadToDelete.id));

    try {
      const response = await fetch('?/delete', {
        method: 'POST',
        body: formData,
        headers: {
          'x-sveltekit-action': 'true'
        }
      });

      console.log('Delete response status:', response.status);

      if (response.ok) {
        // Close modal first
        showDeleteConfirm = false;
        leadToDelete = null;

        // Force page reload with invalidateAll
        await invalidateAll();

        // Or use goto to navigate to same page (this forces a refresh)
        await goto('/admin/leads', { invalidateAll: true });
      } else if (response.redirected || response.status === 303) {
        // Handle redirect
        showDeleteConfirm = false;
        leadToDelete = null;
        await goto('/admin/leads', { invalidateAll: true });
      } else {
        const result = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Delete failed:', result);
        alert('Failed to delete lead: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting the lead.');
    } finally {
      isDeleting = false;
    }
  }
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

<div class="rounded-2xl border border-admin-border/80 bg-white/80 shadow-card">
  {#if items.length === 0}
    <div class="grid place-items-center py-10 text-center text-admin-muted text-sm">No leads found.</div>
  {:else}
    <!-- Desktop table -->
    <div class="hidden lg:block">
      <div class="overflow-hidden rounded-2xl">
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
          <tbody class="divide-y divide-admin-border/80">
            {#each items as it}
              <tr class="transition hover:bg-admin-sidebar/60">
                <td class="px-4 py-3 text-brand-richBlack font-medium">{it.name}</td>
                <td class="px-4 py-3">
                  <a href={`mailto:${it.email}`} class="text-admin-blue hover:underline">{it.email}</a>
                </td>
                <td class="px-4 py-3 capitalize text-admin-muted">{it.lead_type || '—'}</td>
                <td class="px-4 py-3 text-admin-muted">{it.perk?.title || it.perk_title || '—'}</td>
                <td class="px-4 py-3 text-admin-muted">{it.created_at?.slice(0, 19).replace('T', ' ') || '—'}</td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <div class="inline-flex items-center gap-2">
                    {#if isSuper}
                      <button
                        type="button"
                        on:click={() => confirmDelete(it)}
                        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-admin-border bg-white text-red-600 transition hover:bg-red-50"
                        title="Delete"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    {/if}
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mobile stacked cards -->
    <div class="grid gap-3 lg:hidden">
      {#each items as it}
        <article class="rounded-2xl border border-admin-border bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div class="space-y-1">
            <div class="text-base font-semibold text-brand-richBlack">{it.name}</div>
            <a href={`mailto:${it.email}`} class="text-sm text-admin-blue hover:underline">{it.email}</a>
            <div class="text-xs text-admin-muted capitalize">{it.lead_type || '—'}</div>
            <div class="text-sm text-admin-muted">{it.perk?.title || it.perk_title || '—'}</div>
            <div class="text-xs text-admin-muted">{it.created_at?.slice(0, 19).replace('T', ' ') || '—'}</div>
          </div>
          {#if isSuper}
            <div class="mt-3 flex justify-end">
              <button
                type="button"
                on:click={() => confirmDelete(it)}
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-admin-border bg-white text-red-600 transition hover:bg-red-50"
                title="Delete"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          {/if}
        </article>
      {/each}
    </div>
  {/if}
</div>
<Pagination meta={data.meta} current={data.query} basePath="/admin/leads" />

<ConfirmDialog
  bind:open={showDeleteConfirm}
  title="Delete Lead"
  message="Are you sure you want to delete this lead? This action cannot be undone."
  confirmText={isDeleting ? 'Deleting...' : 'Delete'}
  cancelText="Cancel"
  variant="danger"
  on:confirm={handleConfirmedDelete}
  on:cancel={() => { leadToDelete = null; }}
/>
