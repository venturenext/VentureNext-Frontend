<script>
  import Sidebar from '$lib/components/admin/Sidebar.svelte';
  import Topbar from '$lib/components/admin/Topbar.svelte';
  import Footer from '$lib/components/admin/Footer.svelte';
  export let data;
  import { page } from '$app/stores';
  $: isAuthRoute = $page.url.pathname === '/admin/login';
</script>

{#if isAuthRoute}
  <slot />
{:else}
  <div class="min-h-screen bg-admin-sidebar text-admin-text grid grid-cols-[16rem_1fr]">
    <Sidebar user={data.user} />
    <div class="min-h-screen flex flex-col">
      <Topbar user={data.user} />
      <main class="flex-1 p-6">
        <slot />
      </main>
      <Footer />
    </div>
  </div>
{/if}
