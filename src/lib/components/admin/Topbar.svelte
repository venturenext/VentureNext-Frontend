<script lang="ts">
  export let user: { name?: string; email?: string; role?: string } | undefined;
  const initial = (n?: string) => (n || '?').trim().charAt(0).toUpperCase();
</script>

<header class="h-16 border-b border-admin-border bg-white flex items-center justify-between px-4">
  <div></div> <!-- biarkan kosong untuk kiri -->
  
  <div class="flex items-center gap-4">
    <div class="hidden sm:flex items-center gap-3 pr-2">
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
    <!-- <a href="/admin/logout" class="hidden sm:inline-flex px-3 py-1.5 rounded-lg bg-admin-blue text-white text-sm">Logout</a> -->
  </div>
</header>

