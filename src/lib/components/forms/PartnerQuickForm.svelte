<script lang="ts">
  import { submitPartnerInquiry } from '$lib/api/leads';
  import { isEmail, required } from '$lib/utils/validators';
  import FormInput from './FormInput.svelte';
  import FormButton from './FormButton.svelte';

  export let onSuccess: (() => void) | null = null;

  let name = '';
  let email = '';
  let company = '';
  let offerType: 'SAAS/AI Tools' | 'B2B Services' | 'Lifestyle' | '' = '';
  let loading = false;
  let errors: Record<string, string> = {};
  let success = '';

  async function onSubmit(e: Event) {
    e.preventDefault();
    errors = {};
    if (!required(name)) errors.name = 'Name is required';
    if (!isEmail(email)) errors.email = 'Valid email is required';
    if (!required(company)) errors.company = 'Company is required';
    if (!required(offerType)) errors.offerType = 'Select offer type';
    if (Object.keys(errors).length) return;

    loading = true;
    try {
      const message = `Type of Offer: ${offerType}`;
      await submitPartnerInquiry({ name, email, company, message });
      success = 'Thanks! We\'ll get back to you shortly.';
      if (onSuccess) onSuccess();
      name = email = company = '';
      offerType = '' as any;
    } catch (e) {
      errors.form = 'Failed to submit. Please try again later.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="-mx-5 -mt-5 px-5 py-4 bg-brand-darkGreen/5 border-b"></div>
<div class="mt-4 text-sm text-brand-slateGray">
  Submit your offer and we will review it within 2–3 business days.
  Select the offer type that best matches your perk.
  <div class="hidden" aria-hidden="true"></div>
  
</div>

<form on:submit|preventDefault={onSubmit} class="mt-4 space-y-4">
  {#if errors.form}
    <div class="p-3 rounded bg-red-50 text-red-700 text-sm">{errors.form}</div>
  {/if}
  {#if success}
    <div class="p-3 rounded bg-green-50 text-green-700 text-sm">{success}</div>
  {/if}
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormInput label="Name" name="name" bind:value={name} required error={errors.name} />
    <FormInput label="Company" name="company" bind:value={company} required error={errors.company} />
    <FormInput label="Email" name="email" type="email" bind:value={email} required error={errors.email} />

    <label class="block text-sm">
      <span class="text-gray-700">Type of Offer <span class="text-red-500">*</span></span>
      <select bind:value={offerType} class="mt-1 block w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-darkGreen">
        <option value="">Select one</option>
        <option>SAAS/AI Tools</option>
        <option>B2B Services</option>
        <option>Lifestyle</option>
      </select>
      {#if errors.offerType}<div class="text-xs text-red-600 mt-1">{errors.offerType}</div>{/if}
    </label>
  </div>

  <FormButton {loading} label="Submit Offer" />
  <div class="text-xs text-gray-500">We\'ll review your offer and contact you within 2–3 business days.</div>

</form>
