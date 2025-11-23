<script lang="ts">
  import { SITE_NAME, CTA_BROWSE_LABEL } from '$lib/config';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { env } from '$env/dynamic/public';
  let mobileOpen = false;
  let pathname = '';
  let prevPathname = '';
  export let sections: any[] = [];
  let headerElement: HTMLElement;

  const siteName = SITE_NAME;
  const ctaLabel = CTA_BROWSE_LABEL;

  const topbarLogo = sections?.find?.((s) => s.section_key === 'topbar_logo');
  const topbarLinks = sections?.find?.((s) => s.section_key === 'topbar_links');
  const topbarCta = sections?.find?.((s) => s.section_key === 'topbar_cta');

  const assetBase = (env.PUBLIC_ASSET_BASE || '').replace(/\/$/, '');
  const withAsset = (path?: string | null) => {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    const suffix = path.startsWith('/') ? path : `/${path}`;
    return `${assetBase}${suffix}`;
  };

  const brandTitle = topbarLogo?.title || siteName;
  const brandLogo = withAsset(topbarLogo?.content?.logo_url || null);
  const brandLogoAlt = topbarLogo?.content?.logo_alt || brandTitle;

  const navLinks = Array.isArray(topbarLinks?.content) && topbarLinks.is_active !== false
    ? topbarLinks.content
    : [
        { label: 'Perks', href: '/perks' },
        { label: 'Journal', href: '/journal' },
        { label: 'Partner', href: '/partner' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' }
      ];

  const primaryCta = (() => {
    if (topbarCta?.is_active === false) return null;
    const first = Array.isArray(topbarCta?.content) ? topbarCta.content[0] : null;
    if (first?.href && first?.label) return first;
    return { label: ctaLabel, href: '/perks' };
  })();

  $: pathname = $page.url.pathname;

  // Close mobile menu when navigating to a new route
  $: if (pathname !== prevPathname) {
    if (mobileOpen) mobileOpen = false;
    prevPathname = pathname;
  }
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  // Close mobile menu when clicking outside
  onMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileOpen && headerElement && !headerElement.contains(event.target as Node)) {
        mobileOpen = false;
      }
    };

    // Add delay to prevent immediate closure on toggle click
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<header class="sticky top-0 z-50 bg-brand-darkGreen text-white shadow-md relative" bind:this={headerElement}>
  <div class="container-w flex items-center justify-between h-16 relative z-10">
    <a href="/" class="flex items-center gap-2 font-bold text-lg tracking-tight">
      {#if brandLogo}
        <img src={brandLogo} alt={brandLogoAlt} class="h-8 w-auto" />
      {/if}
      <span>{brandTitle}</span>
    </a>

    <nav class="hidden md:flex items-center gap-6">
      {#each navLinks as link}
        <a
          href={link.href}
          class="hover:text-brand-yellow"
          aria-current={isActive(link.href) ? 'page' : undefined}
          class:text-brand-yellow={isActive(link.href)}
        >
          {link.label}
        </a>
      {/each}
    </nav>

    {#if primaryCta}
      <a
        href={primaryCta.href}
        class="hidden md:inline-flex bg-brand-yellow text-brand-richBlack font-semibold px-4 py-2 rounded-full shadow hover:opacity-90"
      >{primaryCta.label}</a>
    {/if}

    <button
      class="md:hidden p-2 -mr-2 hover:bg-white/10 rounded-md transition-colors"
      type="button"
      aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={mobileOpen}
      aria-controls="mobile-menu"
      on:click={(e) => {
        e.stopPropagation();
        mobileOpen = !mobileOpen;
      }}
    >
      {#if mobileOpen}
        <!-- Close Icon (X) -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      {:else}
        <!-- Hamburger Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      {/if}
    </button>
  </div>

  {#if mobileOpen}
    <div id="mobile-menu" class="absolute top-full left-0 right-0 md:hidden bg-brand-darkGreen border-t border-white/10 animate-slideDown shadow-lg" style="z-index: 9999;">
      <nav class="container-w py-4 space-y-2" aria-label="Mobile navigation">
        {#each navLinks as link}
          <a
            href={link.href}
            class="block px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
            aria-current={isActive(link.href) ? 'page' : undefined}
            class:text-brand-yellow={isActive(link.href)}
            class:font-semibold={isActive(link.href)}
          >
            {link.label}
          </a>
        {/each}
        {#if primaryCta}
          <div class="pt-2">
            <a
              href={primaryCta.href}
              class="inline-flex bg-brand-yellow text-brand-richBlack font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              {primaryCta.label}
            </a>
          </div>
        {/if}
      </nav>
    </div>
  {/if}
</header>
