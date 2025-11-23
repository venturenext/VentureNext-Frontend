<script lang="ts">
  import { submitPartnerInquiry } from '$lib/api/leads';
  import { isEmail, required } from '$lib/utils/validators';
  import FormInput from './FormInput.svelte';
  import FormTextarea from './FormTextarea.svelte';
  import FormButton from './FormButton.svelte';

  let name = '';
  let email = '';
  let company = '';
  let phone = '';
  let contact = '';
  let message = '';
  let loading = false;
  let success = '';
  let errors: Record<string, string> = {};

  async function onSubmit(e: Event) {
    e.preventDefault();
    errors = {};
    if (!required(name)) errors.name = 'Name is required';
    if (!isEmail(email)) errors.email = 'Valid email is required';
    if (!required(company)) errors.company = 'Company is required';
    if (!required(message)) errors.message = 'Message is required';
    if (Object.keys(errors).length) return;

    loading = true;
    success = '';
    try {
      await submitPartnerInquiry({ name, email, company, phone, message, contact });
      success = 'Thanks! We\'ll get back to you shortly.';
      name = email = company = phone = message = contact = '';
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
  <FormInput label="Company" name="company" bind:value={company} required error={errors.company} />
  <FormInput label="Phone" name="phone" type="number" bind:value={phone} />
  <FormInput label="Contact (optional)" name="contact" bind:value={contact} placeholder="WhatsApp/Telegram/LinkedIn" />
  <FormTextarea label="Message" name="message" bind:value={message} required error={errors.message} />
  <FormButton {loading} label="Send Inquiry" />
</form>
