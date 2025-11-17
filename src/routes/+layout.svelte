<script>
  import '../app.css';
  import Header from '$lib/components/layout/Header.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import SEOHead from '$lib/components/seo/SEOHead.svelte';
  import Toast from '$lib/components/ui/Toast.svelte';
  import { page } from '$app/stores';
  $: hideChrome = !!$page.error || $page.status === 404 || $page.url.pathname.startsWith('/admin');
</script>

<SEOHead />

<div class="min-h-screen flex flex-col">
  {#if !hideChrome}
    <Header />
  {/if}
  <main class="flex-1">
    <slot />
  </main>
  {#if !hideChrome}
    <Footer />
  {/if}
  <Toast />
  </div>
