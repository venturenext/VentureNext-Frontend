<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  onMount(() => {
    const token = $page.url.searchParams.get('token');
    if (token) {
      // Redirect to the new admin password reset page
      goto(`/admin/password-reset/${token}`, { replaceState: true });
    } else {
      // No token, redirect to login
      goto('/admin/login', { replaceState: true });
    }
  });
</script>

<div class="min-h-screen bg-admin-white grid place-items-center">
  <div class="text-center">
    <p class="text-admin-muted">Redirecting...</p>
  </div>
</div>
