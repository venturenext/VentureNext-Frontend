<svelte:head>
  <title>Contacts - Admin</title>
</svelte:head>

<script>
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import Modal from '$lib/components/ui/Modal.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';

  export let data;
  const items = data.items || [];
  const norm = (r) => (r || '').toLowerCase().replace(/\s+/g, '').replace(/-/g, '').replace(/_/g, '');
  $: isSuper = norm($page.data?.user?.role) === 'superadmin';

  let showDetailModal = false;
  let selectedContact = null;

  function viewDetails(contact) {
    selectedContact = contact;
    showDetailModal = true;
  }
</script>

<div class="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
  <div>
    <h1 class="text-xl font-semibold text-brand-richBlack">Inbox</h1>
    <p class="text-sm text-admin-muted">Messages from the contact form on your website</p>
  </div>
  <form method="GET" class="flex-1 md:w-96">
    <label class="relative block">
      <span class="sr-only">Search</span>
      <span class="absolute mt-3 inset-y-0 left-3 my-auto text-gray-400">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>
        </svg>
      </span>
      <input name="search" placeholder="Search contacts" value={data?.query?.search}
             class="w-full pl-10 pr-3 py-2 rounded-lg border border-admin-border bg-white focus:outline-none focus:ring-2 focus:ring-admin-blue" />
    </label>
  </form>
</div>

<div class="rounded-2xl border border-admin-border/80 bg-white/80 shadow-card">
  {#if items.length === 0}
    <div class="grid place-items-center py-10 text-center text-admin-muted text-sm">
      No contact submissions found.
    </div>
  {:else}
    <!-- Desktop table -->
    <div class="hidden lg:block">
      <div class="overflow-hidden rounded-2xl">
        <table class="min-w-full text-sm">
          <thead class="bg-admin-sidebar text-xs uppercase text-admin-muted">
            <tr>
              <th class="text-left px-4 py-3">Name</th>
              <th class="text-left px-4 py-3">Email</th>
              <th class="text-left px-4 py-3">Subject</th>
              <th class="text-left px-4 py-3">Message</th>
              <th class="text-left px-4 py-3">Date</th>
              <th class="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-admin-border/80">
            {#each items as contact}
              <tr class="transition hover:bg-admin-sidebar/60">
                <td class="px-4 py-3 font-medium text-brand-richBlack">{contact.name}</td>
                <td class="px-4 py-3">
                  <a href={`mailto:${contact.email}`} class="text-admin-blue hover:underline">
                    {contact.email}
                  </a>
                </td>
                <td class="px-4 py-3">{contact.subject || '—'}</td>
                <td class="px-4 py-3">
                  <div class="max-w-xs truncate">
                    {contact.message || '—'}
                  </div>
                </td>
                <td class="px-4 py-3 text-admin-muted">
                  {contact.created_at ? new Date(contact.created_at).toLocaleDateString() : '—'}
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <div class="inline-flex items-center gap-2">
                    <button
                      type="button"
                      on:click={() => viewDetails(contact)}
                      class="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-admin-border bg-white transition hover:bg-gray-50"
                      title="View Details"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    {#if isSuper}
                      <form method="POST" action="?/delete" use:enhance class="inline-block">
                        <input type="hidden" name="id" value={contact.id} />
                        <button
                          class="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-admin-border bg-white text-red-600 transition hover:bg-red-50"
                          title="Delete"
                        >
                          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </form>
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
      {#each items as contact}
        <article class="rounded-2xl border border-admin-border bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <div class="text-[11px] uppercase tracking-[0.14em] text-admin-muted">{contact.email}</div>
              <div class="text-base font-semibold text-brand-richBlack">{contact.name}</div>
              <p class="text-sm text-brand-slateGray line-clamp-2">{contact.subject || '—'}</p>
            </div>
            <button
              type="button"
              on:click={() => viewDetails(contact)}
              class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-admin-border bg-white text-brand-richBlack transition hover:bg-gray-50"
              title="View Details"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
          <div class="mt-2 text-xs text-admin-muted">
            {contact.created_at ? new Date(contact.created_at).toLocaleDateString() : '—'}
          </div>
          <div class="mt-2 text-sm text-brand-slateGray line-clamp-3">{contact.message || '—'}</div>
          {#if isSuper}
            <form method="POST" action="?/delete" use:enhance class="mt-3 flex justify-end">
              <input type="hidden" name="id" value={contact.id} />
              <button
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-admin-border bg-white text-red-600 transition hover:bg-red-50"
                title="Delete"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </form>
          {/if}
        </article>
      {/each}
    </div>
  {/if}
</div>
<Pagination meta={data.meta} current={data.query} basePath="/admin/contacts" />


{#if showDetailModal && selectedContact}
  <Modal bind:open={showDetailModal} title="Contact Details" on:close={() => (showDetailModal = false)}>
    <div class="space-y-4">
      <div>
        <div class="block text-sm font-medium text-admin-muted">Name</div>
        <p class="mt-1 text-brand-richBlack">{selectedContact.name}</p>
      </div>

      <div>
        <div class="block text-sm font-medium text-admin-muted">Email</div>
        <p class="mt-1">
          <a href={`mailto:${selectedContact.email}`} class="text-admin-blue hover:underline">
            {selectedContact.email}
          </a>
        </p>
      </div>

      <div>
        <div class="block text-sm font-medium text-admin-muted">Subject</div>
        <p class="mt-1 text-brand-richBlack">{selectedContact.subject || '—'}</p>
      </div>

      <div>
        <div class="block text-sm font-medium text-admin-muted">Message</div>
        <div class="mt-1 p-4 bg-gray-50 rounded-lg text-brand-richBlack whitespace-pre-wrap">
          {selectedContact.message || '—'}
        </div>
      </div>

      <div>
        <div class="block text-sm font-medium text-admin-muted">Submitted</div>
        <p class="mt-1 text-admin-muted">
          {selectedContact.created_at ? new Date(selectedContact.created_at).toLocaleString() : '—'}
        </p>
      </div>

      <div class="flex justify-end gap-2 pt-4 border-t border-admin-border">
        <a
          href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'Your message'}`}
          class="px-4 py-2 rounded-lg bg-admin-blue text-white hover:bg-admin-blue/90"
        >
          Reply via Email
        </a>
        <button
          type="button"
          on:click={() => (showDetailModal = false)}
          class="px-4 py-2 rounded-lg border border-admin-border hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  </Modal>
{/if}
