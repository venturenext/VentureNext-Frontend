<script lang="ts">
  import { goto } from '$app/navigation';
  import { HERO_IMAGE, SITE_NAME } from '$lib/config';
  let showPassword = false;
  let email = '';
  let password = '';
  let remember = false;
  let errorMsg: string | null = null;

  async function onSubmit(e: Event) {
    e.preventDefault();
    errorMsg = null;
    try {
      const res = await fetch('/admin/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, remember })
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Login failed');
      }
      await goto('/admin');
    } catch (err: any) {
      errorMsg = err?.message || 'Invalid email or password';
    }
  }
</script>

<section class="min-h-screen bg-admin-white text-admin-text grid place-items-center">
  <div class="w-full max-w-5xl px-4 sm:px-6 lg:px-8">
    <div class="bg-white rounded-[28px] shadow-card border border-admin-border overflow-hidden grid grid-cols-1 md:grid-cols-2">
      <!-- Left: Hero inside the same card -->
      <div class="relative min-h-[220px] md:min-h-[520px]">
        <img src={HERO_IMAGE} alt="Hero" class="absolute inset-0 w-full h-full object-cover" />
        <div class="absolute inset-0 bg-brand-darkGreen/70"></div>
        <div class="relative h-full p-8 lg:p-10 flex flex-col justify-end text-white">
          <img src="/logo.svg" alt={SITE_NAME} class="h-8 w-auto mb-8 opacity-95" />
          <h2 class="text-3xl md:text-4xl leading-tight font-extrabold tracking-tight">
            Your next adventure awaits!
          </h2>
          <p class="mt-3 text-white/90 max-w-md text-sm">
            Log in to manage perks, content, and leads. Utility-first admin built for speed.
          </p>
          <p class="mt-3 text-xs text-white/70">Your journey starts here.</p>
        </div>
      </div>

      <!-- Right: Form inside the same card -->
      <div class="flex items-center">
        <div class="w-full p-6 sm:p-10">
          <div class="mb-6">
            <div class="text-2xl font-extrabold text-brand-richBlack">Welcome back!</div>
            <div class="text-sm text-admin-muted mt-1">Please enter your details.</div>
          </div>

          <form class="space-y-4" on:submit={onSubmit}>
            <div>
              <label for="email" class="block text-sm text-admin-muted">Email</label>
              <input id="email" name="email" bind:value={email} type="email" autocomplete="email" required class="mt-1 w-full border border-admin-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-blue" />
            </div>
            <div>
              <label for="password" class="block text-sm text-admin-muted">Password</label>
              <div class="relative mt-1">
                <input id="password" name="password" bind:value={password} type={showPassword ? 'text' : 'password'} autocomplete="current-password" required class="w-full border border-admin-border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-admin-blue" />
                <button type="button" class="absolute inset-y-0 right-2 my-auto h-8 w-8 grid place-items-center text-admin-muted hover:text-admin-text" aria-label={showPassword ? 'Hide password' : 'Show password'} on:click={() => (showPassword = !showPassword)}>
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
            <div class="flex items-center justify-between text-sm">
              <label class="inline-flex items-center gap-2 text-admin-muted">
                <input type="checkbox" name="remember" bind:checked={remember} class="rounded border-admin-border" /> Remember me
              </label>
              <a href="/admin/password-reset" class="text-admin-text hover:underline">Forgot password</a>
            </div>

            {#if errorMsg}
              <div class="text-sm text-red-600">{errorMsg}</div>
            {/if}

            <button type="submit" class="w-full inline-flex justify-center items-center px-4 py-2.5 rounded-lg bg-brand-darkGreen text-white font-semibold hover:brightness-110">Sign in</button>
          </form>

          <div class="mt-6 text-center text-xs text-admin-muted">
            Superadmin and Content Editor access
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
