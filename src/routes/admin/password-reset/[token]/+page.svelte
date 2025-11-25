<script lang="ts">
  import { goto } from '$app/navigation';
  import { env } from '$env/dynamic/public';

  export let data;
  const HERO_IMAGE = env.PUBLIC_HERO_IMAGE || '/images/hero.svg';

  let email = '';
  let password = '';
  let passwordConfirmation = '';
  let showPassword = false;
  let showPasswordConfirmation = false;
  let errorMsg: string | null = null;
  let loading = false;
  let success = false;

  $: token = data.token;

  async function onSubmit(e: Event) {
    e.preventDefault();
    errorMsg = null;
    loading = true;

    if (password !== passwordConfirmation) {
      errorMsg = 'Passwords do not match';
      loading = false;
      return;
    }

    if (password.length < 8) {
      errorMsg = 'Password must be at least 8 characters';
      loading = false;
      return;
    }

    try {
      const res = await fetch('/admin/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          token,
          password,
          password_confirmation: passwordConfirmation
        })
      });

      const json = await res.json();

      if (!res.ok || !json?.success) {
        throw new Error(json?.error || json?.message || 'Failed to reset password');
      }

      success = true;
      setTimeout(() => {
        goto('/admin/login');
      }, 2000);
    } catch (err: any) {
      errorMsg = err?.message || 'Failed to reset password';
    } finally {
      loading = false;
    }
  }
</script>

<section class="min-h-screen bg-admin-white text-admin-text grid place-items-center">
  <div class="w-full max-w-5xl px-4 sm:px-6 lg:px-8">
    <div class="bg-white rounded-[28px] shadow-card border border-admin-border overflow-hidden grid grid-cols-1 md:grid-cols-2">

      <div class="relative min-h-[220px] md:min-h-[520px]">
        <img src={HERO_IMAGE} alt="Hero" class="absolute inset-0 w-full h-full object-cover" />
        <div class="absolute inset-0 bg-brand-darkGreen/70"></div>
        <div class="relative h-full p-8 lg:p-10 flex flex-col items-center justify-center text-center text-white">
          <h2 class="text-3xl md:text-4xl leading-tight font-extrabold tracking-tight">
            Set New Password
          </h2>
          <p class="mt-3 text-white/90 max-w-md text-sm">
            Create a strong password to secure your account.
          </p>
        </div>
      </div>

      <div class="flex items-center justify-center">
        <div class="w-full max-w-md p-6 sm:p-10">
          {#if !success}
            <div class="mb-6">
              <div class="text-2xl font-extrabold text-brand-richBlack text-center">Reset Password</div>
              <div class="text-sm text-admin-muted mt-1 text-center">Enter your new password below.</div>
            </div>

            <form class="space-y-4" on:submit={onSubmit}>
              <div>
                <label for="email" class="block text-sm text-admin-muted">Email</label>
                <input
                  id="email"
                  name="email"
                  bind:value={email}
                  type="email"
                  autocomplete="email"
                  required
                  disabled={loading}
                  class="mt-1 w-full border border-admin-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-blue disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label for="password" class="block text-sm text-admin-muted">New Password</label>
                <div class="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    bind:value={password}
                    type={showPassword ? 'text' : 'password'}
                    autocomplete="new-password"
                    required
                    minlength="8"
                    disabled={loading}
                    class="w-full border border-admin-border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-admin-blue disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-2 my-auto h-8 w-8 grid place-items-center text-admin-muted hover:text-admin-text"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    on:click={() => (showPassword = !showPassword)}
                  >
                    {#if showPassword}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a21.77 21.77 0 0 1 5.06-7.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 10 8 10 8a21.8 21.8 0 0 1-3.22 4.49"/>
                        <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    {:else}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                        <path d="M1 12s3-8 11-8 11 8 11 8-3 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    {/if}
                  </button>
                </div>
              </div>

              <div>
                <label for="password-confirmation" class="block text-sm text-admin-muted">Confirm Password</label>
                <div class="relative mt-1">
                  <input
                    id="password-confirmation"
                    name="password_confirmation"
                    bind:value={passwordConfirmation}
                    type={showPasswordConfirmation ? 'text' : 'password'}
                    autocomplete="new-password"
                    required
                    minlength="8"
                    disabled={loading}
                    class="w-full border border-admin-border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-admin-blue disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-2 my-auto h-8 w-8 grid place-items-center text-admin-muted hover:text-admin-text"
                    aria-label={showPasswordConfirmation ? 'Hide password' : 'Show password'}
                    on:click={() => (showPasswordConfirmation = !showPasswordConfirmation)}
                  >
                    {#if showPasswordConfirmation}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a21.77 21.77 0 0 1 5.06-7.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 10 8 10 8a21.8 21.8 0 0 1-3.22 4.49"/>
                        <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    {:else}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                        <path d="M1 12s3-8 11-8 11 8 11 8-3 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    {/if}
                  </button>
                </div>
              </div>

              {#if errorMsg}
                <div class="text-sm text-red-600">{errorMsg}</div>
              {/if}

              <button
                type="submit"
                disabled={loading}
                class="w-full inline-flex justify-center items-center px-4 py-2.5 rounded-lg bg-brand-darkGreen text-white font-semibold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>

              <div class="text-center">
                <a href="/admin/login" class="text-sm text-admin-text hover:underline">Back to login</a>
              </div>
            </form>
          {:else}
            <div class="text-center space-y-4">
              <div class="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div class="text-2xl font-extrabold text-brand-richBlack">Password Reset!</div>
              <p class="text-sm text-admin-muted">
                Your password has been reset successfully. Redirecting to login...
              </p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</section>
