<script lang="ts">
  import { toastStore, type ToastItem } from '$lib/stores/toast';
  import { fly } from 'svelte/transition';
  let items: ToastItem[] = [];
  const unsub = toastStore.subscribe((v) => (items = v));
  $: items;

</script>

<div class="fixed z-50 top-4 right-4 space-y-2">
  {#each items as t (t.id)}
    <div in:fly={{ x: 16, duration: 150 }} out:fly={{ x: 16, duration: 150 }}
      class={`min-w-[240px] max-w-sm px-4 py-3 rounded shadow-card text-sm
      ${t.type === 'success' ? 'bg-green-600 text-white' : t.type === 'error' ? 'bg-red-600 text-white' : 'bg-brand-darkGreen text-white'}`}
    >
      {t.message}
    </div>
  {/each}
</div>

