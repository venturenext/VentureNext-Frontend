<script lang="ts">
  export let user: { name?: string; email?: string; role?: string } | undefined;
  export let sidebarOpen: boolean = false;
  const initial = (n?: string) => (n || '?').trim().charAt(0).toUpperCase();
</script>

<header class="h-16 border-b border-admin-border bg-white flex items-center justify-between px-4">

  <button
    id="mobile-menu-toggle"
    type="button"
    class="lg:hidden p-2 -ml-2 rounded-md hover:bg-gray-100 transition-colors"
    aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
    aria-expanded={sidebarOpen}
    on:click={(e) => {
      e.stopPropagation();
      sidebarOpen = !sidebarOpen;
    }}
  >
    {#if sidebarOpen}

      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    {:else}

      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    {/if}
  </button>

  <div class="flex items-center gap-4 ml-auto">
    <div class="hidden sm:flex items-center gap-3">
      <div class="text-right">
        <div class="text-sm font-medium text-brand-richBlack">
          {user?.name || 'Admin'}
        </div>
        <div class="text-xs text-admin-muted">
          {user?.role || 'Role'}
        </div>
      </div>
      <div class="w-9 h-9 rounded-full bg-admin-sidebar flex items-center justify-center text-sm font-semibold text-brand-richBlack">
        {initial(user?.name)}
      </div>
    </div>

  </div>
</header>

