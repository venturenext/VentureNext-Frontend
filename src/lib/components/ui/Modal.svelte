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
    class="fixed inset-0 z-50 overflow-y-auto"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    on:click={onBackdrop}
    on:keydown={(e) => e.key === 'Escape' && close()}
  >
    <div class="absolute inset-0 bg-black/50" role="presentation"></div>
    <div class="flex min-h-full items-center justify-center p-4">
      <div class={`relative w-full ${maxW}`} aria-live="polite">
        <div class="bg-white rounded-2xl shadow-xl ring-1 ring-black/5 overflow-hidden max-h-[90vh] flex flex-col">
          {#if title}
            <div class="px-4 py-3 border-b flex-shrink-0">
              <div class="flex items-center justify-between">
                <div class="font-semibold text-brand-richBlack">{title}</div>
                <button class="text-gray-500 hover:text-brand-richBlack text-2xl leading-none" on:click={close} aria-label="Close" type="button">&times;</button>
              </div>
            </div>
          {/if}
          <div class="p-5 overflow-y-auto">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
