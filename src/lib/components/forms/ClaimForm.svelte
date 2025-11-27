<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { submitPerkClaim } from '$lib/api/leads';
  import { isEmail, required } from '$lib/utils/validators';
  import { trackFormSubmission } from '$lib/utils/analytics';
  import FormInput from './FormInput.svelte';
  import FormTextarea from './FormTextarea.svelte';
  import FormButton from './FormButton.svelte';

  export let perkId: number;
  const dispatch = createEventDispatcher();
  let name = '';
  let email = '';
  let company = '';
  let phone = '';
  let message = '';
  let loading = false;
  let success = '';
  let errors: Record<string, string> = {};

  async function onSubmit(e: Event) {
    e.preventDefault();
    errors = {};
    if (!required(name)) errors.name = 'Name is required';
    if (!isEmail(email)) errors.email = 'Valid email is required';
    if (Object.keys(errors).length) return;

    loading = true;
    success = '';
    try {
      await submitPerkClaim({ perk_id: perkId, name, email, company, phone, message });

      // Track form submission after successful submit
      trackFormSubmission(perkId);

      success = 'Thanks! We\'ve received your claim.';
      name = email = company = phone = message = '';

      // Close modal after 1 second
      setTimeout(() => {
        dispatch('success');
      }, 1000);
    } catch (e) {
      errors.form = 'Failed to submit. Please try again later.';
    } finally {
      loading = false;
    }
  }
</script>

<form
  on:submit|preventDefault={onSubmit}
  class="space-y-5 rounded-2xl border border-gray-100 bg-white/70 p-5 shadow-card backdrop-blur-sm"
>
  <div class="space-y-1">
    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-slateGray">Claim this perk</p>
    <p class="text-sm text-gray-600">Share your details and we will confirm the perk via email.</p>
  </div>

  {#if errors.form}
    <div class="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50/70 px-3 py-2 text-sm text-red-700">
      <span aria-hidden="true">!</span>
      <span>{errors.form}</span>
    </div>
  {/if}
  {#if success}
    <div class="flex items-start gap-2 rounded-xl border border-green-100 bg-green-50/70 px-3 py-2 text-sm text-green-700">
      <span aria-hidden="true">✓</span>
      <span>{success}</span>
    </div>
  {/if}

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <FormInput label="Name" name="name" bind:value={name} required error={errors.name} />
    <FormInput label="Email" name="email" type="email" bind:value={email} required error={errors.email} />
    <FormInput label="Company" name="company" bind:value={company} placeholder="Your company or team name" />
    <FormInput label="Phone" name="phone" type="tel" bind:value={phone} placeholder="+62 812 xxxx xxxx" />
  </div>

  <FormTextarea label="Message" name="message" bind:value={message} placeholder="Anything else we should know?" />

  <div class="flex justify-end">
    <FormButton {loading} label="Submit Claim" />
  </div>
</form>
