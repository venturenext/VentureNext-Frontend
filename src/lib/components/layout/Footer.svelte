<script lang="ts">
  import { SITE_NAME } from '$lib/config';
  export let sections: any[] = [];

  const siteName = SITE_NAME;

  const navLinks = Array.isArray(sections?.find?.((s) => s.section_key === 'footer_nav_links')?.content)
    ? sections.find((s) => s.section_key === 'footer_nav_links').content
    : Array.isArray(sections?.find?.((s) => s.section_key === 'footer_primary_links')?.content)
      ? [
          ...sections.find((s) => s.section_key === 'footer_primary_links').content,
          ...(Array.isArray(sections?.find?.((s) => s.section_key === 'footer_secondary_links')?.content)
            ? sections.find((s) => s.section_key === 'footer_secondary_links').content
            : [])
        ]
      : [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Terms of Service', href: '/terms' },
          { label: 'Privacy Policy', href: '/privacy' }
        ];

  const socialLinks = Array.isArray(sections?.find?.((s) => s.section_key === 'footer_social_links')?.content)
    ? sections.find((s) => s.section_key === 'footer_social_links').content
    : [];

  const year = new Date().getFullYear();

  const iconPath = (label: string) => {
    const name = label?.toLowerCase?.() || '';
    if (name.includes('twitter')) return 'M23 4.5a9.5 9.5 0 0 1-2.7.74 4.6 4.6 0 0 0 2-2.55 9.16 9.16 0 0 1-2.92 1.12 4.57 4.57 0 0 0-7.78 4.17A13 13 0 0 1 3.1 3.67a4.57 4.57 0 0 0 1.41 6.1 4.5 4.5 0 0 1-2.07-.57v.06a4.58 4.58 0 0 0 3.66 4.48 4.6 4.6 0 0 1-2.06.08 4.58 4.58 0 0 0 4.27 3.17A9.16 9.16 0 0 1 2 18.54 13 13 0 0 0 9.03 20.6c8.46 0 13.09-7 13.09-13.06 0-.2 0-.39-.01-.59A9.3 9.3 0 0 0 23 4.5z';
    if (name.includes('instagram')) return 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm8.75 1.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z';
    if (name.includes('linkedin')) return 'M5.5 9.5h3v11h-3v-11zm1.5-5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5zM10.5 9.5h2.8l.2 1a3.5 3.5 0 0 1 3.25-1.1c2.04.3 3.25 1.63 3.25 4.18V20.5h-3v-5.9c0-1.29-.5-2.1-1.6-2.2-1.14-.11-1.9.72-1.9 2.14v5.96h-3v-11z';
    if (name.includes('facebook')) return 'M15 4h3V0h-3c-3.3 0-6 2.7-6 6v2H6v4h3v12h4V12h3l1-4h-4V6c0-1.1.9-2 2-2z';
    if (name.includes('youtube')) return 'M21.8 8.001s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-0.9C16.7 5 12 5 12 5h0s-4.7 0-7 .1c-.4.1-1.2.1-2 0.9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.6c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.9.8 2.4.9 1.8.2 7.6.2 7.6.2s4.7 0 7-.2c.4-.1 1.2-.1 2-0.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.6c0-1.6-.2-3.2-.2-3.2zM10 14.7V9.3l5.2 2.7L10 14.7z';
    if (name.includes('tiktok')) return 'M16.5 3.5c.5.9 1.4 1.7 2.5 1.9v3.1c-1.5-.1-2.9-.6-4-1.5v6.2c0 3-2.4 5.4-5.4 5.4S4.2 16.2 4.2 13.2s2.4-5.4 5.4-5.4c.3 0 .6 0 .9.1v3.2c-.3-.1-.6-.1-.9-.1-1.2 0-2.1.9-2.1 2.1 0 1.2.9 2.1 2.1 2.1 1.2 0 2.1-.9 2.1-2.1V2h2.8c0 .5 0 1.1 0 1.5z';
    if (name.includes('github')) return 'M12 .5C5.7.5.7 5.5.7 11.8c0 5 3.2 9.2 7.6 10.7.6.1.8-.3.8-.6v-2c-3.1.7-3.7-1.3-3.7-1.3-.6-1.5-1.4-1.9-1.4-1.9-1.2-.8.1-.8.1-.8 1.3.1 2 .9 2 .9 1.2 2 3.2 1.4 4 .9.1-.9.5-1.4.8-1.8-2.5-.3-5.2-1.3-5.2-5.8 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.6 11.6 0 0 1 6 0c2.2-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 2 1.2 3.3 0 4.5-2.7 5.5-5.3 5.8.5.4.9 1.2.9 2.4v3.5c0 .3.2.7.8.6 4.4-1.5 7.6-5.7 7.6-10.7C23.3 5.5 18.3.5 12 .5z';
    return '';
  };
</script>

<footer class="bg-brand-darkGreen mt-16 text-white/80">
  <div class="container-w py-4 space-y-4 text-sm">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <nav class="flex flex-wrap items-center gap-x-5 gap-y-2">
        {#each navLinks as link}
          <a href={link.href} class="hover:text-white transition-colors">{link.label}</a>
        {/each}
      </nav>

      <div class="flex items-center gap-4">
        {#each socialLinks as link}
          {#if iconPath(link.icon || link.label)}
            <a href={link.href} class="hover:text-white transition-colors" aria-label={link.label}>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d={iconPath(link.icon || link.label)} />
              </svg>
            </a>
          {:else}
            <a
              href={link.href}
              class="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wide hover:text-white hover:bg-white/20 transition-colors"
              aria-label={link.label}
            >
              {(link.label || '?').charAt(0)}
            </a>
          {/if}
        {/each}
      </div>
    </div>

    <div class="border-t border-white/10 pt-3 text-center text-xs text-white/60">
      &copy; {year} {siteName}. All rights reserved.
    </div>
  </div>
</footer>
