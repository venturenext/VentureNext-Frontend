<svelte:head>
  <title>Edit Perk - Admin</title>
</svelte:head>

<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto, invalidateAll } from '$app/navigation';
  import PerkFormFields from '$lib/components/admin/PerkFormFields.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  export let data;
  const categories = data.categories ?? [];
  const subcategories = data.subcategories ?? [];
  const locations = data.locations ?? [];
  const perk = data.perk;
  const formError = data?.form?.error;
  const publishedInfo = perk?.published_at ? new Date(perk.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not published yet';

  let isFormValid = true;
  let successModalOpen = false;
  let successTitle = '';
  let successDescription = '';
  let successStatus = 'updated';
  let errorModalOpen = false;
  let errorMessage = '';

  function formatErrors(payload: any) {
    if (!payload) return 'Failed to update perk. Please check the form and try again.';

    // Handle 413 Request Entity Too Large
    if (payload.status === 413) {
      return 'Upload too large. Please reduce image file sizes (max 2MB per file recommended) or upload fewer images at once.';
    }

    if (typeof payload === 'string') return payload;
    if (payload.error && typeof payload.error === 'string') return payload.error;
    if (payload.errors && typeof payload.errors === 'object') {
      const parts = Object.entries(payload.errors).map(
        ([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`
      );
      if (parts.length) return parts.join(' | ');
    }
    return 'Failed to update perk. Please check the form and try again.';
  }

  const successCopy = {
    save: {
      title: 'Draft saved',
      description: 'Your changes have been saved as draft. Click "Publish" when ready to make it live.'
    },
    publish: {
      title: 'Perk published',
      description: 'The perk is now live and visible to users. You will be returned to the listing with the latest data.'
    }
  };

  const handleSuccessRedirect = async () => {
    successModalOpen = false;
    await goto(`/admin/perks?status=${successStatus}&refresh=${Date.now()}`, { replaceState: true });
  };

  $: if (formError) {
    errorMessage = formatErrors(formError);
    errorModalOpen = true;
  }

  const enhancePerkForm = ({ formData }) => {
    const intent = String(formData.get('intent') || 'save') === 'publish' ? 'publish' : 'save';
    return async ({ result, update }) => {
      await update();
      if (result.type === 'success') {
        successTitle = successCopy[intent].title;
        successDescription = successCopy[intent].description;
        successStatus = intent === 'publish' ? 'published' : 'updated';
        successModalOpen = true;
        await invalidateAll();
      } else if (result.type === 'failure') {
        errorMessage = formatErrors(result.data);
        errorModalOpen = true;
      }
    };
  };
</script>

<div class="space-y-6">
  <section class="rounded-2xl border border-admin-border bg-white p-6">
    <p class="text-xs font-semibold uppercase tracking-[0.3em] text-admin-muted">Admin CMS</p>
    <h1 class="mt-2 text-2xl font-semibold text-brand-richBlack">Edit perk · {perk.title}</h1>
    <p class="text-sm text-admin-muted">Partner: {perk.partner_name} · Status: {perk.status} · Published: {publishedInfo}</p>
  </section>

  <form method="POST" enctype="multipart/form-data" use:enhance={enhancePerkForm} class="space-y-6 rounded-2xl border border-admin-border bg-white p-6">
    <PerkFormFields {categories} {subcategories} {locations} {perk} bind:isFormValid />
    <div class="flex flex-wrap justify-end gap-3">
      <a href="/admin/perks" class="rounded-lg border border-admin-border px-5 py-2 text-sm font-semibold text-admin-muted">
        Cancel
      </a>
      <button
        type="submit"
        name="intent"
        value="save"
        disabled={!isFormValid}
        class="rounded-lg border border-admin-border bg-white px-5 py-2 text-sm font-semibold text-admin-muted hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
        Save as Draft
      </button>
      <button
        type="submit"
        name="intent"
        value="publish"
        disabled={!isFormValid}
        class="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
        Publish
      </button>
    </div>
  </form>
</div>

<Modal bind:open={successModalOpen} title={successTitle || 'Perk updated'} size="sm" on:close={handleSuccessRedirect}>
  <div class="flex items-start gap-3">
    <div class="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
    <p class="text-sm text-brand-slateGray">{successDescription || 'Your update completed successfully.'}</p>
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

<Modal bind:open={errorModalOpen} title="Submission failed" size="sm" on:close={() => (errorModalOpen = false)}>
  <div class="flex items-start gap-3">
    <div class="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="13" />
        <circle cx="12" cy="16" r="1" />
      </svg>
    </div>
    <p class="text-sm text-brand-slateGray">{errorMessage || 'We could not save this perk. Please try again.'}</p>
  </div>
  <div class="mt-6 flex justify-end">
    <button
      type="button"
      class="rounded-lg bg-admin-blue px-4 py-2 text-sm font-semibold text-white"
      on:click={() => (errorModalOpen = false)}>
      Got it
    </button>
  </div>
</Modal>
