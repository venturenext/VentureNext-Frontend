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
  let passwordMessage = '';
  let passwordMessageType = '';
  let emailMessage = '';
  let emailMessageType = '';

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

  const enhancePassword = () => {
    passwordMessage = 'Changing password...';
    passwordMessageType = 'info';

    return async ({ result, update, formElement }) => {
      await update();

      if (result.type === 'success') {
        passwordMessage = 'Password changed successfully!';
        passwordMessageType = 'success';
        formElement.reset();

        setTimeout(() => {
          passwordMessage = '';
        }, 3000);
      } else if (result.type === 'failure') {
        passwordMessage = result.data?.error || 'Failed to change password.';
        passwordMessageType = 'error';
      }
    };
  };

  const enhanceEmail = () => {
    emailMessage = 'Changing email...';
    emailMessageType = 'info';

    return async ({ result, update, formElement }) => {
      if (result.type === 'success') {
        // Update local user data jika ada
        if (result.data?.email && data.user) {
          data.user.email = result.data.email;
        }

        emailMessage = 'Email changed successfully!';
        emailMessageType = 'success';
        formElement.reset();

        await update();

        setTimeout(() => {
          emailMessage = '';
        }, 3000);
      } else if (result.type === 'failure') {
        emailMessage = result.data?.error || 'Failed to change email.';
        emailMessageType = 'error';
      }

      await update();
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

  <section class="rounded-2xl border border-admin-border bg-white p-6 space-y-6">
    <div>
      <h2 class="text-lg font-semibold text-brand-richBlack">Account Security</h2>
      <p class="text-sm text-admin-muted">Update your password and email address</p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <div class="space-y-4">
        <h3 class="text-base font-medium text-brand-richBlack">Change Password</h3>
        {#if passwordMessage}
          <div class={`rounded-lg border px-3 py-2 text-sm ${passwordMessageType === 'success' ? 'border-green-200 bg-green-50 text-green-700' : passwordMessageType === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>
            {passwordMessage}
          </div>
        {/if}
        <form method="POST" action="?/changePassword" use:enhance={enhancePassword} class="space-y-3">
          <div>
            <label for="pwd_current" class="text-sm font-medium text-admin-muted block mb-1">Current Password</label>
            <input id="pwd_current" type="password" name="current_password" required placeholder="Enter your current password"
                   class="w-full rounded-lg border border-admin-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-blue" />
          </div>
          <div>
            <label for="pwd_new" class="text-sm font-medium text-admin-muted block mb-1">New Password</label>
            <input id="pwd_new" type="password" name="new_password" required placeholder="Min 8 characters, mixed case, numbers, symbols"
                   class="w-full rounded-lg border border-admin-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-blue" />
          </div>
          <div>
            <label for="pwd_confirm" class="text-sm font-medium text-admin-muted block mb-1">Confirm New Password</label>
            <input id="pwd_confirm" type="password" name="new_password_confirmation" required placeholder="Re-enter new password"
                   class="w-full rounded-lg border border-admin-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-blue" />
          </div>
          <button type="submit" class="px-4 py-2 rounded-lg bg-admin-blue text-sm font-semibold text-white w-full">
            Change Password
          </button>
        </form>
      </div>

      <div class="space-y-4">
        <h3 class="text-base font-medium text-brand-richBlack">Change Email</h3>
        {#if emailMessage}
          <div class={`rounded-lg border px-3 py-2 text-sm ${emailMessageType === 'success' ? 'border-green-200 bg-green-50 text-green-700' : emailMessageType === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>
            {emailMessage}
          </div>
        {/if}
        <form method="POST" action="?/changeEmail" use:enhance={enhanceEmail} class="space-y-3">
          <div>
            <label for="current_email" class="text-sm font-medium text-admin-muted block mb-1">Current Email</label>
            <input id="current_email" type="email" value={data.user?.email || ''} disabled
                   class="w-full rounded-lg border border-admin-border bg-gray-50 px-3 py-2 text-gray-600 cursor-not-allowed" />
          </div>
          <div>
            <label for="email_pwd_current" class="text-sm font-medium text-admin-muted block mb-1">Current Password</label>
            <input id="email_pwd_current" type="password" name="current_password" required placeholder="Enter your current password for verification"
                   class="w-full rounded-lg border border-admin-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-blue" />
          </div>
          <div>
            <label for="new_email" class="text-sm font-medium text-admin-muted block mb-1">New Email Address</label>
            <input id="new_email" type="email" name="new_email" required placeholder="Enter your new email address"
                   class="w-full rounded-lg border border-admin-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-blue" />
          </div>
          <button type="submit" class="px-4 py-2 rounded-lg bg-admin-blue text-sm font-semibold text-white w-full">
            Change Email
          </button>
        </form>
      </div>
    </div>
  </section>

    <form method="POST" action="?/updateSettings" use:enhance={enhanceSettings} class="space-y-8 rounded-2xl border border-admin-border bg-white p-6">
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
