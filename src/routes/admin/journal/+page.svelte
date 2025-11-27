<svelte:head>
  <title>Journal - Admin</title>
</svelte:head>

<script>
  import Modal from '$lib/components/ui/Modal.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import { invalidateAll } from '$app/navigation';
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  export let data;
  $: items = data.items || [];
  const norm = (r) => (r || '').toLowerCase().replace(/\s+/g, '').replace(/-/g, '').replace(/_/g, '');
  $: isSuper = norm($page.data?.user?.role) === 'superadmin';
  let showDeleteConfirm = false;
  let deleteTarget = null;
  let deleteError = '';
  let successModalOpen = false;
  let successMessage = '';

  function promptDelete(item) {
    deleteTarget = item;
    deleteError = '';
    showDeleteConfirm = true;
  }

  const deleteEnhance = () => {
    return async ({ result, update }) => {
      await update();
      if (result.type === 'success') {
        showDeleteConfirm = false;
        deleteTarget = null;
        successMessage = 'Journal post has been deleted successfully.';
        successModalOpen = true;
        await invalidateAll();
      } else if (result.type === 'failure') {
        deleteError = result.data?.error || 'Failed to delete journal post';
      }
    };
  };
</script>

<div class="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
  <h1 class="text-xl font-semibold text-brand-richBlack">Journal</h1>
  <div class="flex items-center gap-3 w-full md:w-auto">
    <form method="GET" class="flex-1 md:w-80">
      <label class="relative block">
        <span class="sr-only">Search</span>
        <span class="absolute mt-3 inset-y-0 left-3 my-auto text-gray-400">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
        </span>
        <input name="search" placeholder="Search journal posts" value={data?.query?.search}
               class="w-full pl-10 pr-3 py-2 rounded-lg border border-admin-border bg-white focus:outline-none focus:ring-2 focus:ring-admin-blue" />
      </label>
    </form>
    <a href="/admin/journal/new" class="px-4 py-2 rounded-lg bg-admin-blue text-white text-center">Create Post</a>
  </div>
</div>

<div class="rounded-2xl border border-admin-border/80 bg-white/80 shadow-card">
  {#if items.length === 0}
    <div class="grid place-items-center py-10 text-center text-admin-muted text-sm">
      No journal posts found.
    </div>
  {:else}
    <!-- Desktop table -->
    <div class="hidden lg:block">
      <div class="overflow-hidden rounded-2xl">
        <table class="min-w-full text-sm">
          <thead class="bg-admin-sidebar/80 text-admin-muted uppercase text-xs">
            <tr>
              <th class="text-left px-4 py-3">Title</th>
              <th class="text-left px-4 py-3">Category</th>
              <th class="text-left px-4 py-3">Status</th>
              <th class="text-left px-4 py-3">Published</th>
              <th class="text-left px-4 py-3">Tags</th>
              <th class="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-admin-border/80">
            {#each items as item}
              <tr class="transition hover:bg-admin-sidebar/60">
                <td class="px-4 py-3 text-brand-richBlack font-medium">{item.title}</td>
                <td class="px-4 py-3 text-admin-muted">{item.category || item.category_data?.name || 'Uncategorized'}</td>
                <td class="px-4 py-3">
                  <span class={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase ring-1 ${item.is_published ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-gray-50 text-admin-muted ring-gray-200'}`}>
                    {item.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td class="px-4 py-3 text-admin-muted">{item.published_at ? new Date(item.published_at).toLocaleDateString() : '—'}</td>
                <td class="px-4 py-3 text-admin-muted">{(item.tags || []).join(', ') || '—'}</td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <div class="inline-flex items-center gap-2">
                    <a href={`/admin/journal/${item.id}`} class="inline-flex items-center gap-1 rounded-lg bg-brand-darkGreen px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-110">
                      Edit
                    </a>
                    {#if isSuper}
                      <button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-admin-border bg-white text-red-600 transition hover:bg-red-50" title="Delete" on:click={() => promptDelete(item)}>
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
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
      {#each items as item}
        <article class="rounded-2xl border border-admin-border bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <div class="text-[11px] uppercase tracking-[0.14em] text-admin-muted">{item.category || item.category_data?.name || 'Uncategorized'}</div>
              <div class="text-base font-semibold text-brand-richBlack">{item.title}</div>
              <p class="text-xs text-admin-muted">{item.published_at ? new Date(item.published_at).toLocaleDateString() : '—'}</p>
              <p class="text-sm text-brand-slateGray line-clamp-2">{(item.tags || []).join(', ') || '—'}</p>
            </div>
            <span class={`rounded-full px-3 py-1 text-xs font-semibold uppercase ring-1 ${item.is_published ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-gray-50 text-admin-muted ring-gray-200'}`}>
              {item.is_published ? 'Published' : 'Draft'}
            </span>
          </div>
          <div class="mt-3 flex items-center justify-end gap-2">
            <a href={`/admin/journal/${item.id}`} class="inline-flex items-center gap-1 rounded-lg bg-brand-darkGreen px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-110">
              Edit
            </a>
            {#if isSuper}
              <button
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-admin-border bg-white text-red-600 transition hover:bg-red-50"
                title="Delete"
                on:click={() => promptDelete(item)}>
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
              </button>
            {/if}
          </div>
        </article>
      {/each}
    </div>
  {/if}
</div>
<Pagination meta={data.meta} current={data.query} basePath="/admin/journal" />

<Modal bind:open={showDeleteConfirm} title="Delete Journal Post" on:close={() => (showDeleteConfirm = false)}>
  <form method="POST" action="?/delete" use:enhance={deleteEnhance}>
    <input type="hidden" name="id" value={deleteTarget?.id} />
    <p class="text-sm text-admin-muted">
      Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This action cannot be undone.
    </p>
    {#if deleteError}
      <div class="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{deleteError}</div>
    {/if}
    <div class="mt-4 flex justify-end gap-2">
      <button type="button" class="px-4 py-2 rounded-lg border border-admin-border" on:click={() => (showDeleteConfirm = false)}>Cancel</button>
      <button type="submit" class="px-4 py-2 rounded-lg bg-red-600 text-white">Delete</button>
    </div>
  </form>
</Modal>

<Modal bind:open={successModalOpen} title="Success" on:close={() => (successModalOpen = false)}>
  <p class="text-sm text-admin-muted">{successMessage}</p>
  <div class="mt-6 flex justify-end">
    <button type="button" class="rounded-lg bg-admin-blue px-4 py-2 text-sm font-semibold text-white" on:click={() => (successModalOpen = false)}>
      OK
    </button>
  </div>
</Modal>
