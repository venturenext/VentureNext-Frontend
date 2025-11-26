<script>
  import Modal from '$lib/components/ui/Modal.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import { enhance } from '$app/forms';
  import { goto, invalidateAll } from '$app/navigation';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  export let data;
  $: items = data.items || [];
  let openCreate = false;
  let openEdit = false;
  let editItem = null;
  let successModalOpen = false;
  let successTitle = '';
  let successDescription = '';
  let successStatus = 'created';

  let deleteModalOpen = false;
  let deleteTarget = null;
  let deleteLoading = false;

  let createError = '';
  let editError = '';
  let deleteError = '';
  let successAlert = '';

  const flashMessages = {
    created: 'Location created successfully.',
    updated: 'Location updated successfully.',
    deleted: 'Location deleted successfully.'
  };

  const successCopy = {
    create: {
      title: 'Location created successfully',
      description: 'This location can now be assigned to perks.'
    },
    update: {
      title: 'Location updated successfully',
      description: 'We saved your changes.'
    }
  };

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

  const handleSuccessRedirect = async () => {
    successModalOpen = false;
    await goto(`/admin/locations?status=${successStatus}&refresh=${Date.now()}`, { replaceState: true });
    await invalidateAll();
  };

  function makeSuccessEnhance(closeFn, type, targetError) {
    return () => async ({ result, update }) => {
      await update();
      if (result.type === 'success') {
        closeFn();
        successTitle = successCopy[type].title;
        successDescription = successCopy[type].description;
        successStatus = type === 'create' ? 'created' : 'updated';
        successModalOpen = true;
        targetError('');
        await invalidateAll();
      } else if (result.type === 'failure') {
        targetError(result.data?.error || 'An error occurred');
      }
    };
  }

  const createEnhance = makeSuccessEnhance(() => {
    openCreate = false;
  }, 'create', (msg) => (createError = msg));

  const editEnhance = makeSuccessEnhance(() => {
    openEdit = false;
  }, 'update', (msg) => (editError = msg));

  const deleteEnhance = () => {
    deleteLoading = true;
    return async ({ result, update }) => {
      deleteLoading = false;
      try {
        await update({ reset: false, invalidateAll: false });
      } catch (err) {
        deleteError = err?.message || 'Failed to delete location.';
        return;
      }
      if (result.type === 'success') {
        deleteModalOpen = false;
        successTitle = 'Location deleted';
        successDescription = 'The location has been removed.';
        successStatus = 'deleted';
        successModalOpen = true;
        await invalidateAll();
      } else if (result.type === 'failure') {
        deleteError = result.data?.error || 'Failed to delete location.';
      }
    };
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

  const norm = (r) => (r || '').toLowerCase().replace(/\s+/g, '').replace(/-/g, '').replace(/_/g, '');
  $: isSuper = ['superadmin'].includes(norm($page.data?.user?.role));
</script>

<div class="space-y-6">
  <section class="rounded-2xl border border-admin-border bg-white p-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-admin-muted">PerkPal CMS</p>
        <h1 class="mt-1 text-2xl font-semibold text-brand-richBlack">Locations</h1>
        <p class="text-sm text-admin-muted">Manage the list of regions used for filtering perks.</p>
      </div>
      <button class="rounded-lg bg-admin-blue px-4 py-2 text-sm font-semibold text-white" on:click={() => (openCreate = true)}>
        Add location
      </button>
    </div>
    {#if successAlert}
      <div class="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
        {successAlert}
      </div>
    {/if}
  </section>

  <section class="rounded-2xl border border-admin-border/80 bg-white/80 shadow-card">
    {#if items.length === 0}
      <div class="p-10 text-center text-sm text-admin-muted">No locations yet. Create one to get started.</div>
    {:else}
      <div class="hidden lg:block">
        <div class="overflow-hidden rounded-2xl">
          <table class="min-w-full divide-y divide-admin-border text-sm">
            <thead>
              <tr class="bg-admin-sidebar text-xs uppercase tracking-wide text-admin-muted">
                <th class="px-4 py-3 text-left font-medium">Location</th>
                <th class="px-4 py-3 text-left font-medium">Slug</th>
                <th class="px-4 py-3 text-center font-medium">Status</th>
                <th class="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-admin-border/80">
              {#each items as item}
                <tr class="transition hover:bg-admin-sidebar/60">
                  <td class="px-4 py-3 font-medium text-brand-richBlack">{item.name}</td>
                  <td class="px-4 py-3 text-admin-muted">{item.slug}</td>
                  <td class="px-4 py-3 text-center">
                    <span class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${item.is_active ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-gray-50 text-admin-muted ring-1 ring-gray-200'}`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right whitespace-nowrap">
                    <div class="inline-flex items-center gap-2">
                      <button type="button" class="inline-flex items-center gap-1 rounded-lg bg-brand-darkGreen px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-110" title="Edit" on:click={() => openEditModal(item)}>
                        Edit
                      </button>
                      {#if isSuper}
                        <button
                          type="button"
                          class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-admin-border bg-white text-red-600 transition hover:bg-red-50"
                          title="Delete"
                          on:click={() => openDeleteModal(item)}>
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

      <div class="grid gap-3 lg:hidden">
        {#each items as item}
          <article class="rounded-2xl border border-admin-border bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <div class="text-base font-semibold text-brand-richBlack">{item.name}</div>
                <div class="text-sm text-admin-muted">Slug: {item.slug}</div>
              </div>
              <span class={`rounded-full px-3 py-1 text-xs font-semibold uppercase ring-1 ${item.is_active ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-gray-50 text-admin-muted ring-gray-200'}`}>
                {item.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div class="mt-3 flex items-center justify-end gap-2">
              <button type="button" class="inline-flex items-center gap-1 rounded-lg bg-brand-darkGreen px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-110" title="Edit" on:click={() => openEditModal(item)}>
                Edit
              </button>
              {#if isSuper}
                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-admin-border bg-white text-red-600 transition hover:bg-red-50"
                  title="Delete"
                  on:click={() => openDeleteModal(item)}>
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                </button>
              {/if}
            </div>
          </article>
        {/each}
      </div>
    {/if}
  </section>

  <div class="mt-4">
    <Pagination meta={data.meta} current={data.query} basePath="/admin/locations" />
  </div>
</div>

<Modal bind:open={openCreate} title="Add Location" size="md">
  <form method="POST" action="?/create" use:enhance={createEnhance} class="space-y-4">
    <div>
      <label class="text-sm font-medium text-admin-muted" for="create_name">Name</label>
      <input id="create_name" name="name" required class="mt-1 w-full rounded-lg border border-admin-border px-3 py-2" />
    </div>
    <div>
      <label class="text-sm font-medium text-admin-muted" for="create_slug">Slug</label>
      <input id="create_slug" name="slug" required class="mt-1 w-full rounded-lg border border-admin-border px-3 py-2" />
    </div>
    <div>
      <label class="inline-flex items-center gap-2 text-sm font-medium text-admin-muted">
        <input type="checkbox" name="is_active" checked class="h-4 w-4 rounded border-gray-300 text-admin-blue focus:ring-admin-blue" />
        Active
      </label>
    </div>
    {#if createError}
      <div class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{createError}</div>
    {/if}
    <div class="flex justify-end gap-3 pt-2">
      <button type="button" class="rounded-lg border border-admin-border px-4 py-2 text-sm" on:click={() => (openCreate = false)}>
        Cancel
      </button>
      <button type="submit" class="rounded-lg bg-admin-blue px-4 py-2 text-sm font-semibold text-white">
        Save location
      </button>
    </div>
  </form>
</Modal>


<Modal bind:open={openEdit} title="Edit Location" size="md">
  {#if editItem}
    <form method="POST" action="?/update" use:enhance={editEnhance} class="space-y-4">
      <input type="hidden" name="id" value={editItem.id} />
      <div>
        <label class="text-sm font-medium text-admin-muted" for="edit_name">Name</label>
        <input id="edit_name" name="name" required class="mt-1 w-full rounded-lg border border-admin-border px-3 py-2" bind:value={editItem.name} />
      </div>
      <div>
        <label class="text-sm font-medium text-admin-muted" for="edit_slug">Slug</label>
        <input id="edit_slug" name="slug" required class="mt-1 w-full rounded-lg border border-admin-border px-3 py-2" bind:value={editItem.slug} />
      </div>
      <div>
        <label class="inline-flex items-center gap-2 text-sm font-medium text-admin-muted">
          <input type="checkbox" name="is_active" class="h-4 w-4 rounded border-gray-300 text-admin-blue focus:ring-admin-blue" bind:checked={editItem.is_active} />
          Active
        </label>
      </div>
      {#if editError}
        <div class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{editError}</div>
      {/if}
      <div class="flex justify-end gap-3 pt-2">
        <button type="button" class="rounded-lg border border-admin-border px-4 py-2 text-sm" on:click={() => (openEdit = false)}>
          Cancel
        </button>
        <button type="submit" class="rounded-lg bg-admin-blue px-4 py-2 text-sm font-semibold text-white">
          Save changes
        </button>
      </div>
    </form>
  {/if}
</Modal>


<Modal bind:open={deleteModalOpen} title="Delete location" size="sm" on:close={() => (deleteModalOpen = false)}>
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


<Modal bind:open={successModalOpen} title={successTitle || 'Success'} size="sm" on:close={handleSuccessRedirect}>
  <div class="flex items-start gap-3">
    <div class="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
    <p class="text-sm text-brand-slateGray">{successDescription || 'Action completed successfully.'}</p>
  </div>
  <div class="mt-6 flex justify-end">
    <button type="button" class="rounded-lg bg-admin-blue px-4 py-2 text-sm font-semibold text-white" on:click={handleSuccessRedirect}>
      Back to list
    </button>
  </div>
</Modal>
