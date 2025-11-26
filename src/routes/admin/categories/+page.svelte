<script>
  import Modal from '$lib/components/ui/Modal.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { goto, invalidateAll } from '$app/navigation';
  import { onMount } from 'svelte';
  export let data;
  let openCreate = false;
  let openEdit = false;
  let editItem = null;
  $: items = data.items || [];
  const norm = (r) => (r || '').toLowerCase().replace(/\s+/g, '').replace(/-/g, '').replace(/_/g, '');
  $: isSuper = norm($page.data?.user?.role) === 'superadmin';

  let deleteModalOpen = false;
  let deleteTarget = null;
  let deleteLoading = false;
  let deleteError = '';
  let createError = '';
  let editError = '';

  let successModalOpen = false;
  let successTitle = '';
  let successDescription = '';
  let successStatus = 'updated';

  const flashMessages = {
    created: 'Category created successfully.',
    updated: 'Category updated successfully.',
    deleted: 'Category deleted successfully.'
  };

  let successAlert = '';

  onMount(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const status = url.searchParams.get('status');

    if (status && flashMessages[status]) {
      successAlert = flashMessages[status];
    }

    if (url.searchParams.has('status') || url.searchParams.has('refresh')) {
      url.searchParams.delete('status');
      url.searchParams.delete('refresh');
      history.replaceState({}, '', url);
    }
  });

  const successCopy = {
    create: {
      title: 'Category created successfully',
      description: 'The new category has been added to the CMS.'
    },
    update: {
      title: 'Category updated successfully',
      description: 'Changes have been saved successfully.'
    }
  };

  function openEditModal(item) {
    editItem = { ...item };
    openEdit = true;
    editError = '';
  }

  function openDeleteModal(item) {
    deleteTarget = item;
    deleteModalOpen = true;
    deleteError = '';
  }

  const handleSuccessRedirect = async () => {
    successModalOpen = false;
    await goto(`/admin/categories?status=${successStatus}&refresh=${Date.now()}`, { replaceState: true });
    await invalidateAll();
  };

  function makeSuccessEnhance(closeFn, type, errorVar) {
    return () => async ({ result, update }) => {
      await update();
      if (result.type === 'success') {
        closeFn();
        successTitle = successCopy[type].title;
        successDescription = successCopy[type].description;
        successStatus = type === 'create' ? 'created' : 'updated';
        successModalOpen = true;
        await invalidateAll();
      } else if (result.type === 'failure') {
        if (errorVar === 'createError') {
          createError = result.data?.error || 'An error occurred';
        } else {
          editError = result.data?.error || 'An error occurred';
        }
      }
    };
  }

  const createEnhance = makeSuccessEnhance(() => {
    openCreate = false;
    createError = '';
  }, 'create', 'createError');

  const editEnhance = makeSuccessEnhance(() => {
    openEdit = false;
    editError = '';
  }, 'update', 'editError');

  const deleteEnhance = () => {
    deleteLoading = true;

    return async ({ result, update }) => {
      deleteLoading = false;
      try {
        await update({ reset: false, invalidateAll: false });
      } catch (err) {
        deleteError = err?.message || 'Failed to delete category.';
        return;
      }

      if (result.type === 'success') {
        deleteModalOpen = false;
        successTitle = 'Category deleted successfully';
        successDescription = 'The category has been removed from the CMS.';
        successStatus = 'deleted';
        successModalOpen = true;
        await invalidateAll();
      } else if (result.type === 'failure') {
        deleteError = result.data?.error || 'Failed to delete category.';
      } else {
        deleteError = result.error?.message || 'Failed to delete category.';
      }
    };
  };
</script>

<div class="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
  <h1 class="text-xl font-semibold text-brand-richBlack">Categories</h1>
  <div class="flex items-center gap-3 w-full md:w-auto">
    <form method="GET" class="flex-1 md:w-80">
      <label class="relative block">
        <span class="sr-only">Search</span>
        <span class="absolute inset-y-0 left-3 mt-3 my-auto text-gray-400">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
        </span>
        <input name="search" placeholder="Search categories" value={data?.query?.search}
               class="w-full pl-10 pr-3 py-2 rounded-lg border border-admin-border bg-white focus:outline-none focus:ring-2 focus:ring-admin-blue" />
      </label>
    </form>
    <button class="px-4 py-2 rounded-lg bg-admin-blue text-white" on:click={() => (openCreate = true)}>Create Category</button>
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
      No categories found. Try adjusting your search or create one.
    </div>
  {:else}
    <div class="hidden lg:block">
      <div class="overflow-hidden rounded-2xl">
        <table class="min-w-full text-sm">
          <thead class="bg-admin-sidebar text-xs uppercase text-admin-muted">
            <tr>
              <th class="px-4 py-3 text-left">Category</th>
              <th class="px-4 py-3 text-left">Slug</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-admin-border/80">
            {#each items as it}
              <tr class="transition hover:bg-admin-sidebar/60">
                <td class="px-4 py-3">
                  <div class="font-semibold text-brand-richBlack">{it.name}</div>
                  <div class="text-xs text-admin-muted">Primary category</div>
                </td>
                <td class="px-4 py-3 text-admin-muted">{it.slug}</td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <div class="inline-flex items-center gap-2">
                    <button class="inline-flex items-center gap-1 rounded-lg bg-brand-darkGreen px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-110" title="Edit" on:click={() => openEditModal(it)}>
                      Edit
                    </button>
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

    <div class="grid gap-3 lg:hidden">
      {#each items as it}
        <article class="rounded-2xl border border-admin-border bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <div class="text-[11px] uppercase tracking-[0.14em] text-admin-muted">Slug: {it.slug}</div>
              <div class="text-base font-semibold text-brand-richBlack">{it.name}</div>
            </div>
            <div class="inline-flex items-center gap-2">
              <button class="inline-flex items-center gap-1 rounded-lg bg-brand-darkGreen px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-110" title="Edit" on:click={() => openEditModal(it)}>
                Edit
              </button>
              {#if isSuper}
                <button
                  type="button"
                  class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-admin-border bg-white text-red-600 transition hover:bg-red-50"
                  title="Delete"
                  on:click={() => openDeleteModal(it)}>
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                </button>
              {/if}
            </div>
          </div>
        </article>
      {/each}
    </div>
  {/if}
</div>
<div class="mt-4">
  <Pagination meta={data.meta} current={data.query} basePath="/admin/categories" />
</div>

<Modal bind:open={openCreate} title="Create Category" on:close={() => { openCreate = false; createError = ''; }}>
  <form method="POST" action="?/create" use:enhance={createEnhance} class="space-y-4">
    {#if createError}
      <div class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {createError}
      </div>
    {/if}
    <div>
      <label class="block text-sm text-admin-muted" for="create_name">Name</label>
      <input id="create_name" name="name" required class="mt-1 w-full border border-admin-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-blue" />
    </div>
    <div>
      <label class="block text-sm text-admin-muted" for="create_slug">Slug</label>
      <input id="create_slug" name="slug" required class="mt-1 w-full border border-admin-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-blue" />
    </div>
    <div class="flex justify-end gap-2">
      <button type="button" class="px-4 py-2 rounded-lg border border-admin-border" on:click={() => { openCreate = false; createError = ''; }}>Cancel</button>
      <button type="submit" class="px-4 py-2 rounded-lg bg-admin-blue text-white">Create</button>
    </div>
  </form>
</Modal>

<Modal bind:open={openEdit} title="Edit Category" on:close={() => { openEdit = false; editError = ''; }}>
  {#if editItem}
    <form method="POST" action="?/update" use:enhance={editEnhance} class="space-y-4">
      {#if editError}
        <div class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {editError}
        </div>
      {/if}
      <input type="hidden" name="id" value={editItem.id} />
      <div>
        <label class="block text-sm text-admin-muted" for="edit_name">Name</label>
        <input id="edit_name" name="name" bind:value={editItem.name} required class="mt-1 w-full border border-admin-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-blue" />
      </div>
      <div>
        <label class="block text-sm text-admin-muted" for="edit_slug">Slug</label>
        <input id="edit_slug" name="slug" bind:value={editItem.slug} required class="mt-1 w-full border border-admin-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-blue" />
      </div>
      <div class="flex justify-end gap-2">
        <button type="button" class="px-4 py-2 rounded-lg border border-admin-border" on:click={() => { openEdit = false; editError = ''; }}>Cancel</button>
        <button type="submit" class="px-4 py-2 rounded-lg bg-admin-blue text-white">Save</button>
      </div>
    </form>
  {/if}
</Modal>

<Modal bind:open={successModalOpen} title={successTitle || 'Success'} size="sm" on:close={handleSuccessRedirect}>
  <div class="flex items-start gap-3">
    <div class="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
    <p class="text-sm text-brand-slateGray">{successDescription || 'Operation completed successfully.'}</p>
  </div>
  <div class="mt-6 flex justify-end">
    <button
      type="button"
      class="rounded-lg bg-admin-blue px-4 py-2 text-sm font-semibold text-white"
      on:click={handleSuccessRedirect}>
      Back to listing
    </button>
  </div>
</Modal>

<Modal bind:open={deleteModalOpen} title="Delete category" size="sm" on:close={() => (deleteModalOpen = false)}>
  {#if deleteTarget}
    <form method="POST" action="?/delete" use:enhance={deleteEnhance} class="space-y-4">
      <input type="hidden" name="id" value={deleteTarget.id} />
      <p class="text-sm text-brand-slateGray">You are about to delete <span class="font-semibold text-brand-richBlack">{deleteTarget.name}</span>. This action cannot be undone. Proceed?</p>

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
