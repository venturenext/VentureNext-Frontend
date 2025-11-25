<script lang="ts">
  import { env } from '$env/dynamic/public';
  const HERO_IMAGE = env.PUBLIC_HERO_IMAGE || '/images/hero.svg';

  let email = '';
  let submitted = false;
  let errorMsg: string | null = null;
  let loading = false;

  async function onSubmit(e: Event) {
    e.preventDefault();
    errorMsg = null;
    loading = true;

    try {
      const res = await fetch('/admin/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const json = await res.json();

      if (!res.ok || !json?.success) {
        throw new Error(json?.error || json?.message || 'Failed to send reset link');
      }

      submitted = true;
    } catch (err: any) {
      errorMsg = err?.message || 'Failed to send reset link';
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
            Reset Your Password
          </h2>
          <p class="mt-3 text-white/90 max-w-md text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
      </div>

      <div class="flex items-center justify-center">
        <div class="w-full max-w-md p-6 sm:p-10">
          {#if !submitted}
            <div class="mb-6">
              <div class="text-2xl font-extrabold text-brand-richBlack text-center">Forgot Password?</div>
              <div class="text-sm text-admin-muted mt-1 text-center">No worries, we'll send you reset instructions.</div>
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

              {#if errorMsg}
                <div class="text-sm text-red-600">{errorMsg}</div>
              {/if}

              <button
                type="submit"
                disabled={loading}
                class="w-full inline-flex justify-center items-center px-4 py-2.5 rounded-lg bg-brand-darkGreen text-white font-semibold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div class="text-center">
                <a href="/admin/login" class="text-sm text-admin-text hover:underline">Back to login</a>
              </div>
            </form>
          {:else}
            <div class="text-center space-y-4">
              <div class="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <div class="text-2xl font-extrabold text-brand-richBlack">Check your email</div>
              <p class="text-sm text-admin-muted">
                If an account exists for <strong>{email}</strong>, we've sent a password reset link to it.
              </p>

              <div class="pt-4">
                <a href="/admin/login" class="text-sm text-admin-text hover:underline">Back to login</a>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</section>
