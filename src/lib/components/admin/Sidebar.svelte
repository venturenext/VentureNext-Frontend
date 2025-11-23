<script lang="ts">
  import { page } from '$app/stores';
  export let user: { role?: string; name?: string } | undefined;
  $: path = $page.url.pathname;
  const active = (p: string) => p !== '/admin'
    ? path === p || path.startsWith(p + '/')
    : path === '/admin';
  const norm = (r?: string) => (r || '').toLowerCase().replace(/\s+/g, '').replace(/-/g, '').replace(/_/g, '');
  const isSuper = ['superadmin'].includes(norm(user?.role));
  const isContentEditor = ['contenteditor'].includes(norm(user?.role));
  const initial = (n?: string) => (n || '?').trim().charAt(0).toUpperCase();

  const managementLinks = [
    { href: '/admin', label: 'Dashboard', icon: 'grid' },
    { href: '/admin/perks', label: 'Perks', icon: 'sparkles' },
    { href: '/admin/categories', label: 'Categories', icon: 'layers' },
    { href: '/admin/subcategories', label: 'Subcategories', icon: 'layers' },
    { href: '/admin/locations', label: 'Locations', icon: 'pin' },
    { href: '/admin/journal', label: 'Journal', icon: 'book' },
    { href: '/admin/leads', label: 'Leads', icon: 'users' },
    { href: '/admin/contacts', label: 'Inbox', icon: 'mail' },
    { href: '/admin/users', label: 'Users', icon: 'user' }
  ];

  const frontendLinks = [
    { href: '/admin/content?page=homepage', label: 'Homepage', icon: 'home', key: 'homepage' },
    { href: '/admin/content?page=perks', label: 'Perks Page', icon: 'sparkles', key: 'perks' },
    { href: '/admin/content?page=journal', label: 'Journal Page', icon: 'book-open', key: 'journal' },
    { href: '/admin/content?page=partner', label: 'Partner Page', icon: 'handshake', key: 'partner' },
    { href: '/admin/content?page=about', label: 'About Page', icon: 'info', key: 'about' },
    { href: '/admin/content?page=contact', label: 'Contact Page', icon: 'mail' , key: 'contact'},
    { href: '/admin/content?page=terms', label: 'Terms of Service', icon: 'doc', key: 'terms' },
    { href: '/admin/content?page=privacy', label: 'Privacy Policy', icon: 'shield', key: 'privacy' },
    { href: '/admin/content?page=topbar', label: 'Top Bar', icon: 'layers', key: 'topbar' },
    { href: '/admin/content?page=footer', label: 'Footer', icon: 'layers', key: 'footer' }
  ];

  const iconPath = (name: string) => {
    switch (name) {
      case 'grid': return 'M3 3h7v7H3V3Zm0 11h7v7H3v-7Zm11-11h7v7h-7V3Zm0 11h7v7h-7v-7Z';
      case 'sparkles': return 'M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2Zm-7 11l.8 2.2L8 16l-2.2.8L5 19l-.8-2.2L2 16l2.2-.8L5 13Zm14-2l.8 2.2L22 13l-2.2.8L19 16l-.8-2.2L16 13l2.2-.8L19 11Z';
      case 'layers': return 'M12 3 3 8l9 5 9-5-9-5Zm0 18-9-5 3.5-2L12 18l5.5-4 3.5 2-9 5Zm0-5-9-5 3.5-2L12 11l5.5-2 3.5 2-9 5Z';
      case 'pin': return 'M12 21s6-5.5 6-10.5S15.5 3 12 3 6 6.5 6 10.5 12 21 12 21Zm0-9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z';
      case 'book': return 'M4 4h9a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4V4Zm0 14h10v-9H4v9Zm12 2V7a3 3 0 0 1 3 3v10a2 2 0 0 0-2-2h-1Z';
      case 'book-open': return 'M12 6.5A6.5 6.5 0 0 0 5.5 13v6.5l6.5-2.5 6.5 2.5V13A6.5 6.5 0 0 0 12 6.5Z';
      case 'users': return 'M16 14a4 4 0 1 0-8 0v1H4a3 3 0 0 0-3 3v2h22v-2a3 3 0 0 0-3-3h-4v-1Zm-4-6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm8 6a3 3 0 0 0-2.2-2.9 4.5 4.5 0 0 0-1.3-4.4 3 3 0 1 1 3.5 4.7V14Z';
      case 'mail': return 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2 8 5 8-5';
      case 'user': return 'M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm-7 9a7 7 0 0 1 14 0Z';
      case 'home': return 'M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9.5Z';
      case 'info': return 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 6.5a1.25 1.25 0 1 1 1.25-1.25A1.25 1.25 0 0 1 12 8.5Zm1.5 9h-3v-1.5h1v-3h-1V11h2a1 1 0 0 1 1 1v4h1Z';
      case 'help': return 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm.1 14.8a1.2 1.2 0 1 1-1.2 1.2 1.2 1.2 0 0 1 1.2-1.2Zm2-6.8c0 1.2-.8 1.8-1.4 2.3-.4.3-.6.5-.6 1v.5h-1.6v-.7c0-1 .5-1.6 1.1-2 .5-.3.9-.6.9-1.1a1.3 1.3 0 1 0-2.6 0H8c0-1.6 1.3-3 3.2-3a3 3 0 0 1 3 3Z';
      case 'shield': return 'M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3Z';
      case 'doc': return 'M6 2h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm0 2v16h12V8h-4V4H6Z';
      case 'handshake': return 'M3 12.5 8.5 7H12l2 2 3-3L21 9l-5 5-2-2-1.5 1.5a2.1 2.1 0 0 1-3 0L8 11l-5 5Z';
      case 'gear': return 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-1a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V22a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 4.21 19.9l.06-.06A1.65 1.65 0 0 0 4.6 18.02 1.65 1.65 0 0 0 3.09 17H3a2 2 0 1 1 0-4h.09c.7 0 1.32-.41 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 7.19l.06.06c.48.48 1.18.63 1.82.33.59-.19 1-.81 1-1.51V6a2 2 0 1 1 4 0v.09c0 .7.41 1.32 1 1.51.64.3 1.34.15 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.48.48-.63 1.18-.33 1.82.19.59.81 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.7 0-1.32.41-1.51 1Z';
      default: return '';
    }
  };
</script>

<aside class="bg-admin-sidebar h-full w-64 border-r border-admin-border">
  <div class="h-16 flex items-center justify-between px-4">
    <a href="/admin" class="inline-flex items-center gap-2 font-semibold text-admin-text">
      <img src="/logo.svg" alt="PerkPal" class="h-6 w-6" />
      <span>PerkPal CMS</span>
    </a>
  </div>
  <nav class="px-3 pt-3 pb-6 text-sm space-y-4">
    <div>
      <div class="text-xs uppercase tracking-wide text-admin-muted px-2 mb-2">CMS</div>
      {#each managementLinks as item (item.href)}
        {#if isSuper || item.href === '/admin'}
          <a
            href={item.href}
            data-sveltekit-noscroll
            class={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${active(item.href) ? 'bg-teal-700 text-white shadow-sm' : 'text-admin-muted hover:bg-white/70 hover:text-admin-text'}`}
          >
            <svg class={`w-4 h-4 ${active(item.href) ? 'text-white' : 'text-admin-muted'}`} viewBox="0 0 24 24" fill={active(item.href) ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="1.8">
              <path d={iconPath(item.icon)} />
            </svg>
            <span>{item.label}</span>
          </a>
        {/if}
      {/each}
    </div>

    {#if isContentEditor}
      <div class="pt-2 border-t border-admin-border">
        <div class="text-xs uppercase tracking-wide text-admin-muted px-2 mb-2">Frontend</div>
        {#each frontendLinks as item (item.href)}
          <a
            href={item.href}
            data-sveltekit-noscroll
            class={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${active('/admin/content') && $page.url.searchParams.get('page') === item.key ? 'bg-teal-700 text-white shadow-sm' : 'text-admin-muted hover:bg-white/70 hover:text-admin-text'}`}
          >
            <svg class={`w-4 h-4 ${active('/admin/content') && $page.url.searchParams.get('page') === item.key ? 'text-white' : 'text-admin-muted'}`} viewBox="0 0 24 24" fill={active('/admin/content') && $page.url.searchParams.get('page') === item.key ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="1.8">
              <path d={iconPath(item.icon)} />
            </svg>
            <span>{item.label}</span>
          </a>
        {/each}
      </div>
    {/if}

    {#if isSuper}
      <div class="pt-2 border-t border-admin-border">
        <div class="text-xs uppercase tracking-wide text-admin-muted px-2 mb-2">Settings</div>
        <a
          href="/admin/settings"
          data-sveltekit-noscroll
          class={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${active('/admin/settings') ? 'bg-teal-700 text-white shadow-sm' : 'text-admin-muted hover:bg-white/70 hover:text-admin-text'}`}
        >
          <svg class={`w-4 h-4 ${active('/admin/settings') ? 'text-white' : 'text-admin-muted'}`} viewBox="0 0 24 24" fill={active('/admin/settings') ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="1.8">
            <path d={iconPath('gear') || 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'} />
          </svg>
          <span>Settings</span>
        </a>
      </div>
    {/if}

    <a href="/admin/logout" class="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-white/60">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
      <span>Log out</span>
    </a>
  </nav>
</aside>
