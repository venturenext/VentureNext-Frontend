<script>
  import SEOHead from '$lib/components/seo/SEOHead.svelte';
  import { SITE_NAME } from '$lib/config';
  export let status;
  export let error;

  const is404 = Number(status) === 404;
  const title = is404 ? 'Page Not Found' : 'Something went wrong';
  const desc = is404
    ? 'Sorry, we couldn\'t find the page you\'re looking for.'
    : (error?.message || 'An unexpected error occurred.');
</script>

<SEOHead title={`${title} | ${SITE_NAME}`} description={desc} />

<!-- Unified modern error page (404 and others) -->
<section class="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-pink-100 via-yellow-50 to-white"></div>
    <div class="absolute -top-28 -right-24 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-yellow-300/60 to-pink-300/40 blur-3xl animate-drift" aria-hidden="true"></div>
    <div class="absolute -bottom-28 -left-24 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-pink-300/50 to-yellow-200/40 blur-3xl animate-float" aria-hidden="true"></div>

    <div class="relative container-w">
      <div class="mx-auto max-w-5xl rounded-[28px] bg-white ring-1 ring-black/5 shadow-2xl p-6 sm:p-10">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <!-- Left copy -->
          <div>
            <div class="inline-flex items-center gap-2 text-brand-darkGreen font-semibold">
              <span class="w-2 h-2 rounded-full bg-yellow-400"></span>
              Oops, wrong turn…
            </div>
            <h1 class="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-brand-richBlack">Can’t find that page</h1>
            <p class="mt-4 text-brand-slateGray leading-relaxed">Looks like you’ve wandered off the beaten path. We’ll help you get back on track and find what you’re looking for.</p>
            <div class="mt-8 flex flex-wrap items-center gap-3">
              <a href="/" class="inline-flex px-5 py-3 rounded-md bg-brand-darkGreen text-white hover:brightness-110">Back to Home</a>
            </div>
          </div>

          <!-- Right illustration (abstract, brand colors) -->
          <div class="relative mx-auto w-full max-w-md">
            <svg viewBox="0 0 360 240" class="w-full h-auto text-brand-darkGreen" role="img" aria-label="Decorative illustration">
              <defs>
                <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stop-color="#fde047"/>
                  <stop offset="100%" stop-color="#facc15"/>
                </linearGradient>
              </defs>
              <rect x="20" y="150" width="90" height="50" rx="10" fill="url(#g1)" stroke="currentColor" stroke-width="2" />
              <circle cx="190" cy="95" r="36" fill="none" stroke="currentColor" stroke-width="2" />
              <rect x="120" y="120" width="70" height="70" transform="rotate(-18 155 155)" fill="white" stroke="currentColor" stroke-width="2" />
              <path d="M250 155 l60 -35 l0 70 z" fill="url(#g1)" stroke="currentColor" stroke-width="2" />
              <circle cx="280" cy="88" r="6" fill="currentColor" />
              <circle cx="305" cy="110" r="4" fill="currentColor" />
              <circle cx="80" cy="120" r="5" fill="currentColor" />
              <path d="M40 205 C80 190, 120 220, 160 205" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              <path d="M200 208 C240 188, 280 218, 320 202" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
</section>

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-14px) scale(1.02); }
  }
  @keyframes drift {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(16px, -12px) rotate(3deg); }
  }
  .animate-float { animation: float 18s ease-in-out infinite; }
  .animate-drift { animation: drift 26s linear infinite; }
</style>
