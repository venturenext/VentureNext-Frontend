<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  export let open = false;
  export let title: string | null = null;
  export let size: 'sm' | 'md' | 'lg' = 'md';
  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }

  function onBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) close();
  }

  let previousOverflow = '';
  onMount(() => {
    previousOverflow = document.body.style.overflow;
    if (open) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  });

  $: if (typeof document !== 'undefined') {
    document.body.style.overflow = open ? 'hidden' : previousOverflow;
  }

  $: maxW = size === 'lg' ? 'max-w-2xl' : size === 'sm' ? 'max-w-md' : 'max-w-xl';
</script>

{#if open}
  <div
    class="fixed inset-0 z-50"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    on:click={onBackdrop}
    on:keydown={(e) => e.key === 'Escape' && close()}
  >
    <div class="absolute inset-0 bg-black/50" role="presentation"></div>
    <div class={`relative mx-auto mt-16 w-full ${maxW} px-4`} aria-live="polite">
      <div class="bg-white rounded-2xl shadow-xl ring-1 ring-black/5 overflow-hidden">
        {#if title}
          <div class="px-4 py-3 border-b">
            <div class="flex items-center justify-between">
              <div class="font-semibold text-brand-richBlack">{title}</div>
              <button class="text-gray-500 hover:text-brand-richBlack" on:click={close} aria-label="Close" type="button">&times;</button>
            </div>
          </div>
        {/if}
        <div class="p-5">
          <slot />
        </div>
      </div>
    </div>
  </div>
{/if}
