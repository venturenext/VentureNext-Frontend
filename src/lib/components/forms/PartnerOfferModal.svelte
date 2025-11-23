<script lang="ts">
  import { submitPartnerInquiry } from '$lib/api/leads';
  import { createEventDispatcher } from 'svelte';
  // Using site brand colors; no illustration on the left per request

  export let onSuccess: (() => void) | null = null;
  const dispatch = createEventDispatcher();

  let name = '';
  let email = '';
  let company = '';
  let contact = '';
  let offerType: 'SAAS/AI Tools' | 'B2B Services' | 'Lifestyle' | '' = '';
  let agree = false;
  let loading = false;
  let errors: Record<string, string> = {};
  let success = '';

  function isEmail(v: string) {
    return /.+@.+\..+/.test(v);
  }
  function required(v: string | boolean) {
    return !!v;
  }

  async function onSubmit(e: Event) {
    e.preventDefault();
    errors = {};
    if (!required(name)) errors.name = 'Name is required';
    if (!isEmail(email)) errors.email = 'Valid email is required';
    if (!required(company)) errors.company = 'Company is required';
    if (!required(offerType)) errors.offerType = 'Select offer type';
    if (!agree) errors.agree = 'Please accept the terms';
    if (Object.keys(errors).length) return;

    loading = true;
    try {
      const message = `Type of Offer: ${offerType}`;
      await submitPartnerInquiry({ name, email, company, message, contact });
      success = 'Thanks! We\'ll get back to you shortly.';
      if (onSuccess) onSuccess();
      name = email = company = contact = '';
      offerType = '' as any;
      agree = false;
    } catch (e) {
      errors.form = 'Failed to submit. Please try again later.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="md:grid md:grid-cols-5 md:gap-0">
  <!-- Left panel (illustration/info) -->
  <aside class="hidden md:flex md:col-span-2 bg-brand-darkGreen/5 border-r px-6 py-8 flex-col rounded-l-2xl">
    <h3 class="text-2xl font-extrabold text-brand-darkGreen">Partner with PerkPal</h3>
    <p class="mt-2 text-sm text-brand-darkGreen/80 leading-relaxed">Share your exclusive offer with our community of founders, freelancers, and remote workers in MY & SG.</p>
    <div class="mt-6 grid grid-cols-3 gap-4">
      <div class="h-20 rounded-xl bg-brand-darkGreen/10 flex items-center justify-center text-3xl text-brand-darkGreen" aria-hidden="true">📝</div>
      <div class="h-20 rounded-xl bg-brand-darkGreen/10 flex items-center justify-center text-3xl text-brand-darkGreen" aria-hidden="true">🔎</div>
      <div class="h-20 rounded-xl bg-brand-darkGreen/10 flex items-center justify-center text-3xl text-brand-darkGreen" aria-hidden="true">🚀</div>
    </div>
    <div class="mt-6 flex gap-1" aria-hidden="true">
      <span class="w-2 h-2 rounded-full bg-brand-darkGreen/70"></span>
      <span class="w-2 h-2 rounded-full bg-brand-darkGreen/40"></span>
      <span class="w-2 h-2 rounded-full bg-brand-darkGreen/20"></span>
    </div>
  </aside>

  <!-- Right panel (form) -->
  <div class="md:col-span-3 px-4 py-6">
    <div class="flex items-center gap-6">
      <h4 class="text-xl font-bold text-brand-richBlack relative">
        <span class="pb-1 border-b-2 border-brand-darkGreen">Submit Offer</span>
      </h4>
      <button class="ml-auto text-gray-500 hover:text-brand-richBlack" type="button" aria-label="Close" on:click={() => dispatch('close')}>×</button>
    </div>

    <form on:submit|preventDefault={onSubmit} class="mt-6 space-y-5">
      {#if errors.form}
        <div class="p-3 rounded bg-red-50 text-red-700 text-sm">{errors.form}</div>
      {/if}
      {#if success}
        <div class="p-3 rounded bg-green-50 text-green-700 text-sm">{success}</div>
      {/if}

      <!-- Full Name -->
      <label class="block">
        <span class="flex items-center text-sm text-gray-600 gap-2">
          <span aria-hidden="true">👤</span> Full Name
        </span>
        <input class="mt-1 block w-full border-0 border-b outline-none focus:border-brand-darkGreen px-0 py-2 bg-transparent" bind:value={name} placeholder="Your full name" />
        {#if errors.name}<div class="text-xs text-red-600 mt-1">{errors.name}</div>{/if}
      </label>

      <!-- Email -->
      <label class="block">
        <span class="flex items-center text-sm text-gray-600 gap-2">
          <span aria-hidden="true">✉️</span> Email
        </span>
        <input type="email" class="mt-1 block w-full border-0 border-b outline-none focus:border-brand-darkGreen px-0 py-2 bg-transparent" bind:value={email} placeholder="email@example.com" />
        {#if errors.email}<div class="text-xs text-red-600 mt-1">{errors.email}</div>{/if}
      </label>

      <!-- Company -->
      <label class="block">
        <span class="flex items-center text-sm text-gray-600 gap-2">
          <span aria-hidden="true">🏢</span> Company Name
        </span>
        <input class="mt-1 block w-full border-0 border-b outline-none focus:border-brand-darkGreen px-0 py-2 bg-transparent" bind:value={company} placeholder="Your company" />
        {#if errors.company}<div class="text-xs text-red-600 mt-1">{errors.company}</div>{/if}
      </label>

      <label class="block">
        <span class="flex items-center text-sm text-gray-600 gap-2">
          <span aria-hidden="true">☎️</span> Contact (optional)
        </span>
        <input class="mt-1 block w-full border-0 border-b outline-none focus:border-brand-darkGreen px-0 py-2 bg-transparent" bind:value={contact} placeholder="WhatsApp/Telegram/LinkedIn" />
      </label>

      <!-- Offer Type -->
      <label class="block">
        <span class="flex items-center text-sm text-gray-600 gap-2">
          <span aria-hidden="true">🏷️</span> Type of Offer
          <span class="text-red-500">*</span>
        </span>
        <select bind:value={offerType} class="mt-1 block w-full border-0 border-b outline-none focus:border-brand-darkGreen px-0 py-2 bg-transparent">
          <option value="">Select one</option>
          <option>SAAS/AI Tools</option>
          <option>B2B Services</option>
          <option>Lifestyle</option>
        </select>
        {#if errors.offerType}<div class="text-xs text-red-600 mt-1">{errors.offerType}</div>{/if}
      </label>

      <!-- Terms -->
      <label class="flex items-center gap-2 text-sm text-gray-600">
        <input type="checkbox" bind:checked={agree} class="rounded border-gray-300 text-brand-darkGreen focus:ring-brand-darkGreen" />
        I agree with the <a href="/terms" class="underline">Terms of Service</a>
        {#if errors.agree}<span class="text-xs text-red-600 ml-2">{errors.agree}</span>{/if}
      </label>

      <button class="mt-2 inline-flex w-full justify-center items-center gap-2 rounded-lg bg-brand-darkGreen px-5 py-3 font-semibold text-white shadow-md hover:brightness-110 disabled:opacity-60" type="submit" disabled={loading}>
        {#if loading}
          <span class="animate-spin inline-block w-4 h-4 border-2 border-white/50 border-t-transparent rounded-full"></span>
        {/if}
        Submit Offer
      </button>
      <div class="text-xs text-gray-500">We'll review your offer and contact you within 2–3 business days.</div>
    </form>
  </div>
</div>

<style>
  /* Ensure rounded corners align with parent modal */
  :global(.svelte-modal-rounded > *) { border-radius: 1rem; }
  /* No global leakage; scoped styles above intentionally minimal */
</style>
