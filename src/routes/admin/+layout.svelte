<script>
  import Sidebar from '$lib/components/admin/Sidebar.svelte';
  import Topbar from '$lib/components/admin/Topbar.svelte';
  import Footer from '$lib/components/admin/Footer.svelte';
  export let data;
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  $: isAuthRoute = $page.url.pathname === '/admin/login';
  let sidebarOpen = false;
  let pathname = '';
  let prevPathname = '';

  $: pathname = $page.url.pathname;

  
  $: if (pathname !== prevPathname) {
    if (sidebarOpen) sidebarOpen = false;
    prevPathname = pathname;
  }

 
  onMount(() => {
    const handleClickOutside = (event) => {
      if (!sidebarOpen) return;
      const sidebar = document.getElementById('mobile-sidebar');
      const toggle = document.getElementById('mobile-menu-toggle');
      if (sidebar && toggle && !sidebar.contains(event.target) && !toggle.contains(event.target)) {
        sidebarOpen = false;
      }
    };

    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

{#if isAuthRoute}
  <slot />
{:else}
  <div class="min-h-screen bg-admin-sidebar text-admin-text lg:grid lg:grid-cols-[16rem_1fr]">
   
    {#if sidebarOpen}
      <div class="fixed inset-0 bg-black/50 z-40 lg:hidden" on:click={() => sidebarOpen = false}></div>
    {/if}

    <div id="mobile-sidebar" class="fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto transform transition-transform duration-300 {sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}">
      <Sidebar user={data.user} />
    </div>

    <div class="min-h-screen flex flex-col">
      <Topbar user={data.user} bind:sidebarOpen />
      <main class="flex-1 p-4 sm:p-6">
        <slot />
      </main>
      <Footer />
    </div>
  </div>
{/if}
