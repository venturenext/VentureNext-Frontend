<script>
  import { goto, invalidateAll } from '$app/navigation';
  import { onMount } from 'svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  export let data;
  let openCreate = false;
  let openEdit = false;
  let editItem = null;
  $: items = data.items || [];
  const norm = (r) => (r || '').toLowerCase().replace(/\s+/g, '').replace(/-/g, '').replace(/_/g, '');
  $: isSuper = norm($page.data?.user?.role) === 'superadmin';
  const flashMessages = {
    created: 'User created successfully.',
    updated: 'User updated successfully.',
    deleted: 'User deleted successfully.'
  };

  let lastFlashKey = data?.flash?.type || '';
  let successAlert =
    data?.flash?.type && flashMessages[data.flash.type] ? flashMessages[data.flash.type] : '';

  $: if (data?.flash?.type !== lastFlashKey) {
    lastFlashKey = data?.flash?.type || '';
    successAlert =
      data?.flash?.type && flashMessages[data.flash.type] ? flashMessages[data.flash.type] : '';
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

  function openDeleteModal(user) {
    deleteTarget = user;
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
        deleteError = err?.message || 'Failed to delete user.';
        return;
      }

      if (result.type === 'success') {
        deleteModalOpen = false;
        successAlert = flashMessages.deleted;
        await invalidateAll();
      } else if (result.type === 'failure') {
        deleteError = result.data?.error || 'Failed to delete user.';
      } else {
        deleteError = result.error?.message || 'Failed to delete user.';
      }
    };
  };

  function openEditModal(item) {
    editItem = { ...item };
    openEdit = true;
  }

  let successModalOpen = false;
  let successTitle = '';
  let successDescription = '';
  let successStatus = 'updated';
  let createError = '';
  let editError = '';

  const successCopy = {
    create: {
      title: 'User created successfully',
      description: 'The new content editor has been added to the CMS.'
    },
    update: {
      title: 'User updated successfully',
      description: 'Changes have been saved successfully.'
    }
  };

  const handleSuccessRedirect = async () => {
    successModalOpen = false;
    await goto(`/admin/users?status=${successStatus}&refresh=${Date.now()}`, { replaceState: true });
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
</script>

<div class="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
  <h1 class="text-xl font-semibold text-brand-richBlack">Users</h1>
  <div class="flex items-center gap-3 w-full md:w-auto">
    <form method="GET" class="flex-1 md:w-80">
      <label class="relative block">
        <span class="sr-only">Search</span>
        <span class="absolute mt-3 inset-y-0 left-3 my-auto text-gray-400">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
        </span>
        <input name="search" placeholder="Search users" value={data?.query?.search}
               class="w-full pl-10 pr-3 py-2 rounded-lg border border-admin-border bg-white focus:outline-none focus:ring-2 focus:ring-admin-blue" />
      </label>
    </form>
    <button class="px-4 py-2 rounded-lg bg-admin-blue text-white" on:click={() => (openCreate = true)}>Create User</button>
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

<div class="bg-white rounded-2xl shadow-card border border-admin-border">
  <div class="overflow-x-auto">
    <table class="min-w-full text-sm">
      <thead class="bg-admin-sidebar/80 text-admin-muted uppercase text-xs">
        <tr>
          <th class="text-left px-4 py-3">Name</th>
          <th class="text-left px-4 py-3">Email</th>
          <th class="text-left px-4 py-3">Role</th>
          <th class="text-left px-4 py-3">Created</th>
          <th class="text-right px-4 py-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each items as user}
          <tr class="border-t border-admin-border hover:bg-admin-sidebar/50">
            <td class="px-4 py-3 text-brand-richBlack font-medium">{user.name}</td>
            <td class="px-4 py-3">{user.email}</td>
            <td class="px-4 py-3">{user.role_label}</td>
            <td class="px-4 py-3">{new Date(user.created_at).toLocaleDateString()}</td>
            <td class="px-4 py-3 text-right whitespace-nowrap">
              <button class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-admin-border bg-white hover:bg-gray-50 mr-1" title="Edit" on:click={() => openEditModal(user)}>
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
              </button>
              {#if isSuper}
                <button
                  type="button"
                  class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-admin-border bg-white text-red-600 hover:bg-red-50"
                  title="Delete"
                  on:click={() => openDeleteModal(user)}>
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                </button>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
<Pagination meta={data.meta} current={data.query} basePath="/admin/users" />

<Modal bind:open={openCreate} title="Create User" on:close={() => { openCreate = false; createError = ''; }}>
  <form method="POST" action="?/create" use:enhance={createEnhance} class="space-y-4">
    {#if createError}
      <div class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {createError}
      </div>
    {/if}
    <div>
      <label class="block text-sm text-admin-muted" for="create_name">Name</label>
      <input id="create_name" name="name" required class="mt-1 w-full rounded-lg border border-admin-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-blue" />
    </div>
    <div>
      <label class="block text-sm text-admin-muted" for="create_email">Email</label>
      <input id="create_email" name="email" type="email" required class="mt-1 w-full rounded-lg border border-admin-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-blue" />
    </div>
    <div>
      <label class="block text-sm text-admin-muted" for="create_password">Password</label>
      <input id="create_password" name="password" type="password" required class="mt-1 w-full rounded-lg border border-admin-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-blue" />
    </div>
    <input type="hidden" name="role" value="content_editor" />
    <div class="flex justify-end gap-2">
      <button type="button" class="px-4 py-2 rounded-lg border border-admin-border" on:click={() => { openCreate = false; createError = ''; }}>Cancel</button>
      <button type="submit" class="px-4 py-2 rounded-lg bg-admin-blue text-white">Create</button>
    </div>
  </form>
</Modal>

<Modal bind:open={openEdit} title="Edit User" on:close={() => { openEdit = false; editError = ''; }}>
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
        <input id="edit_name" name="name" bind:value={editItem.name} required class="mt-1 w-full rounded-lg border border-admin-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-blue" />
      </div>
      <div>
        <label class="block text-sm text-admin-muted" for="edit_email">Email</label>
        <input id="edit_email" name="email" type="email" bind:value={editItem.email} required class="mt-1 w-full rounded-lg border border-admin-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-blue" />
      </div>
      <div>
        <label class="block text-sm text-admin-muted" for="edit_password">Password (leave blank to keep current)</label>
        <input id="edit_password" name="password" type="password" class="mt-1 w-full rounded-lg border border-admin-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-blue" />
      </div>
      <input type="hidden" name="role" value="content_editor" />
      <p class="text-xs text-admin-muted">Only content editors can be managed here.</p>
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

<Modal bind:open={deleteModalOpen} title="Delete user" size="sm" on:close={() => (deleteModalOpen = false)}>
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
