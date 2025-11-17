<script lang="ts">
  import { submitContact } from '$lib/api/leads';
  import { isEmail, required } from '$lib/utils/validators';
  import FormInput from './FormInput.svelte';
  import FormTextarea from './FormTextarea.svelte';
  import FormButton from './FormButton.svelte';

  let name = '';
  let email = '';
  let subject = '';
  let message = '';
  let loading = false;
  let success = '';
  let errors: Record<string, string> = {};

  async function onSubmit(e: Event) {
    e.preventDefault();
    errors = {};
    if (!required(name)) errors.name = 'Name is required';
    if (!isEmail(email)) errors.email = 'Valid email is required';
    if (!required(subject)) errors.subject = 'Subject is required';
    if (!required(message)) errors.message = 'Message is required';
    if (Object.keys(errors).length) return;

    loading = true;
    success = '';
    try {
      await submitContact({ name, email, subject, message });
      success = 'Thanks! Your message has been sent.';
      name = email = subject = message = '';
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
  <FormInput label="Subject" name="subject" bind:value={subject} required error={errors.subject} />
  <FormTextarea label="Message" name="message" bind:value={message} required error={errors.message} />
  <FormButton {loading} label="Send Message" />
</form>

