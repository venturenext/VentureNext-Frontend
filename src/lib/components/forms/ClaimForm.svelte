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

<form on:submit|preventDefault={onSubmit} class="space-y-4">
  {#if errors.form}
    <div class="p-3 rounded bg-red-50 text-red-700 text-sm">{errors.form}</div>
  {/if}
  {#if success}
    <div class="p-3 rounded bg-green-50 text-green-700 text-sm">{success}</div>
  {/if}
  <FormInput label="Name" name="name" bind:value={name} required error={errors.name} />
  <FormInput label="Email" name="email" type="email" bind:value={email} required error={errors.email} />
  <FormInput label="Company" name="company" bind:value={company} />
  <FormInput label="Phone" name="phone" type="number" bind:value={phone} />
  <FormTextarea label="Message" name="message" bind:value={message} />
  <FormButton {loading} label="Submit Claim" />
  </form>

