<script>
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import Modal from '$lib/components/ui/Modal.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  export let data;
  $: items = data.items || [];
  const norm = (r) => (r || '').toLowerCase().replace(/\s+/g, '').replace(/-/g, '').replace(/_/g, '');
  $: isSuper = norm($page.data?.user?.role) === 'superadmin';

  const flashMessages = {
    created: 'Perk created successfully.',
    published: 'Perk published successfully.',
    updated: 'Perk updated successfully.',
    deleted: 'Perk deleted successfully.'
  };

  let successAlert = '';
  if (data?.flash?.type && flashMessages[data.flash.type]) {
    successAlert = flashMessages[data.flash.type];
  }

  onMount(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (url.searchParams.has('status') || url.searchParams.has('refresh')) {
      url.searchParams.delete('status');
      url.searchParams.delete('refresh');
      history.replaceState({}, '', url);
    }
  });

  let deleteModalOpen = false;
  let deleteTarget = null;
  let deleteLoading = false;
  let deleteError = '';

  function openDeleteModal(perk) {
    deleteTarget = perk;
    deleteModalOpen = true;
    deleteError = '';
  }

  const deleteEnhance = () => {
    deleteLoading = true;

    return async ({ result, update }) => {
      deleteLoading = false;
      try {
        await update({ reset: false, invalidateAll: false });
      } catch (err) {
        deleteError = err?.message || 'Failed to delete perk.';
        return;
      }

      if (result.type === 'success') {
        deleteModalOpen = false;
        successAlert = flashMessages.deleted;
        await invalidateAll();
      } else if (result.type === 'failure') {
        deleteError = result.data?.error || 'Failed to delete perk.';
      } else {
        deleteError = result.error?.message || 'Failed to delete perk.';
      }
    };
  };
</script>

<!-- Header row with search and create button -->
<div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
  <h1 class="text-xl font-semibold text-brand-richBlack">Perks</h1>
  <div class="flex w-full items-center gap-3 md:w-auto">
    <form method="GET" class="flex-1 md:w-80">
      <label class="relative block">
        <span class="sr-only">Search</span>
        <span class="absolute inset-y-0 left-3 my-auto mt-3 text-gray-400">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
        </span>
        <input
          name="search"
          placeholder="Search by title or partner"
          value={data?.query?.search}
          class="w-full rounded-lg border border-admin-border bg-white py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-admin-blue"
        />
      </label>
    </form>
    <a href="/admin/perks/new" class="rounded-lg bg-admin-blue px-4 py-2 text-center text-white">Create Perk</a>
  </div>
</div>

{#if successAlert}
  <div class="mb-4 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
    <div class="flex items-center gap-2">
      <svg class="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span>{successAlert}</span>
    </div>
    <button type="button" class="text-green-700 hover:text-green-900" on:click={() => (successAlert = '')} aria-label="Close">
      &times;
    </button>
  </div>
{/if}

<div class="rounded-2xl border border-admin-border/80 bg-white/80 shadow-card">
  {#if items.length === 0}
    <div class="grid place-items-center py-10 text-center text-admin-muted text-sm">
      No perks found. Try adjusting your search or create a new perk.
    </div>
  {:else}
    <!-- Desktop table -->
    <div class="hidden lg:block">
      <div class="overflow-hidden rounded-2xl">
        <table class="min-w-full text-sm">
          <thead class="bg-admin-sidebar text-xs uppercase text-admin-muted">
            <tr>
              <th class="px-4 py-3 text-left">Perk</th>
              <th class="px-4 py-3 text-left">Partner</th>
              <th class="px-4 py-3 text-left">Location</th>
              <th class="px-4 py-3 text-left">Redeem</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-admin-border/80">
            {#each items as it}
              <tr class="transition hover:bg-admin-sidebar/60">
                <td class="px-4 py-3">
                  <div class="font-semibold text-brand-richBlack">{it.title}</div>
                  <div class="text-xs text-admin-muted line-clamp-2">{it.subtitle || it.description || '—'}</div>
                </td>
                <td class="px-4 py-3">
                  <div class="text-sm font-medium text-brand-richBlack">{it.partner_name}</div>
                  <div class="text-[11px] uppercase tracking-[0.12em] text-admin-muted">ID #{it.id}</div>
                </td>
                <td class="px-4 py-3 capitalize">{it.location_label ?? it.location}</td>
                <td class="px-4 py-3">
                  {#if it.redeem_type}
                    <span class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-admin-border/70 text-[11px] font-semibold uppercase text-brand-richBlack">
                      {it.redeem_type.replace('_', ' ')}
                    </span>
                  {:else}
                    <span class="text-xs text-admin-muted">—</span>
                  {/if}
                </td>
                <td class="px-4 py-3">
                  <span class="rounded-full px-3 py-1 text-xs font-semibold uppercase ring-1
                    {it.status === 'published' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' :
                    it.status === 'archived' ? 'bg-orange-50 text-orange-700 ring-orange-200' :
                    'bg-gray-50 text-admin-muted ring-gray-200'}">
                    {it.status}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="inline-flex items-center gap-2">
                    <a href={`/admin/perks/${it.id}`} class="inline-flex items-center gap-1 rounded-lg bg-brand-darkGreen px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-110">
                      Edit
                    </a>
                    {#if isSuper}
                      <button
                        type="button"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-admin-border bg-white text-red-600 transition hover:bg-red-50"
                        title="Delete"
                        on:click={() => openDeleteModal(it)}>
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
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <div class="text-[11px] uppercase tracking-[0.14em] text-admin-muted">#{it.id} - {it.partner_name}</div>
              <div class="text-base font-semibold text-brand-richBlack">{it.title}</div>
              <p class="text-sm text-brand-slateGray line-clamp-2">{it.subtitle || it.description || '—'}</p>
            </div>
            <span class="rounded-full px-3 py-1 text-xs font-semibold uppercase ring-1
              {it.status === 'published' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' :
              it.status === 'archived' ? 'bg-orange-50 text-orange-700 ring-orange-200' :
              'bg-gray-50 text-admin-muted ring-gray-200'}">
              {it.status}
            </span>
          </div>
          <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-admin-muted">
            <span class="inline-flex items-center gap-2 rounded-full bg-admin-sidebar px-3 py-1 capitalize ring-1 ring-admin-border/70">
              <svg class="h-4 w-4 text-admin-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {it.location_label ?? it.location}
            </span>
            {#if it.redeem_type}
              <span class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-admin-border/70 text-[11px] font-semibold uppercase text-brand-richBlack">
                {it.redeem_type.replace('_', ' ')}
              </span>
            {/if}
          </div>
          <div class="mt-3 flex items-center justify-end gap-2">
            <a href={`/admin/perks/${it.id}`} class="inline-flex items-center gap-1 rounded-lg bg-brand-darkGreen px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-110">
              Edit
            </a>
            {#if isSuper}
              <button
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-admin-border bg-white text-red-600 transition hover:bg-red-50"
                title="Delete"
                on:click={() => openDeleteModal(it)}>
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
              </button>
            {/if}
          </div>
        </article>
      {/each}
    </div>
  {/if}
</div>
<div class="mt-4">
  <Pagination meta={data.meta} current={data.query} basePath="/admin/perks" />
</div>

<Modal bind:open={deleteModalOpen} title="Delete perk" size="sm" on:close={() => (deleteModalOpen = false)}>
  {#if deleteTarget}
    <form method="POST" action="?/delete" use:enhance={deleteEnhance} class="space-y-4">
      <input type="hidden" name="id" value={deleteTarget.id} />
      <p class="text-sm text-brand-slateGray">This will permanently remove <span class="font-semibold text-brand-richBlack">{deleteTarget.title}</span>. This action cannot be undone. Are you sure?</p>

      {#if deleteError}
        <div class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{deleteError}</div>
      {/if}

      <div class="flex justify-end gap-2">
        <button type="button" class="rounded-lg border border-admin-border px-4 py-2 text-sm" on:click={() => (deleteModalOpen = false)} disabled={deleteLoading}>Cancel</button>
        <button type="submit" class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" disabled={deleteLoading}>
          {deleteLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </form>
  {/if}
</Modal>



