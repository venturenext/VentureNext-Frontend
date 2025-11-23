<script>
  import { enhance } from '$app/forms';
  import { invalidate } from '$app/navigation';
  export let data;
  let grouped = [];
  $: if (data) {
    let counter = 0;
    const groupedRaw = data.grouped || {};
    grouped = Object.entries(groupedRaw).map(([group, entries]) => ({
      group,
      items: entries.map((item) => ({ ...item, _index: counter++ }))
    }));
  }

  let message = '';
  let messageType = '';

  const enhanceSettings = () => {
    message = 'Saving settings...';
    messageType = 'success';

    return async ({ result, update }) => {
      try {
        await update();
      } catch (err) {
        message = err?.message || 'Submission failed.';
        messageType = 'error';
        return;
      }

      if (result.type === 'success') {
        message = 'Settings saved successfully.';
        messageType = 'success';
        await invalidate('/admin/settings');
      } else if (result.type === 'failure') {
        message = result.data?.error || 'Failed to update settings.';
        messageType = 'error';
      } else {
        message = result.error?.message || 'Submission failed.';
        messageType = 'error';
      }
    };
  };

  const formatLabel = (key) => key
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const booleanOptions = [
    { label: 'Yes', value: '1' },
    { label: 'No', value: '0' }
  ];
</script>

<div class="space-y-6">
  <section class="rounded-2xl border border-admin-border bg-white p-6">
    <p class="text-xs font-semibold uppercase tracking-[0.3em] text-admin-muted">Settings</p>
    <h1 class="mt-2 text-2xl font-semibold text-brand-richBlack">Platform settings</h1>
    <p class="text-sm text-admin-muted">Edit feature flags, defaults, and integrations centrally.</p>
  </section>

  {#if message}
    <div class={`rounded-2xl border px-4 py-3 text-sm ${messageType === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
      {message}
    </div>
  {/if}

    <form method="POST" use:enhance={enhanceSettings} class="space-y-8 rounded-2xl border border-admin-border bg-white p-6">
    {#each grouped as section}
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-brand-richBlack">{section.group || 'General'}</h2>
          <span class="text-xs uppercase tracking-[0.3em] text-admin-muted">{section.items.length} items</span>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          {#each section.items as setting}
            <div class="space-y-2">
              <input type="hidden" name={`settings[${setting._index}][key]`} value={setting.key} />
              <p class="text-sm font-medium text-admin-muted">{formatLabel(setting.key)}</p>
              {#if setting.type === 'boolean'}
                <select name={`settings[${setting._index}][value]`}
                        bind:value={setting.value}
                        class="w-full rounded-lg border border-admin-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-blue">
                  {#each booleanOptions as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              {:else if setting.type === 'text'}
                <textarea name={`settings[${setting._index}][value]`} rows="3"
                          bind:value={setting.value}
                          class="w-full rounded-lg border border-admin-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-blue"></textarea>
              {:else}
                <input name={`settings[${setting._index}][value]`} bind:value={setting.value}
                       class="w-full rounded-lg border border-admin-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-blue" />
              {/if}
            </div>
          {/each}
        </div>
      </section>
    {/each}
    <div class="flex justify-end">
      <button type="submit" class="px-5 py-2 rounded-lg bg-admin-blue text-sm font-semibold text-white">Save settings</button>
    </div>
  </form>
</div>
