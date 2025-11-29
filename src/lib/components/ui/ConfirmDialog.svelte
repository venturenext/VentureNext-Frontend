<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let open = false;
  export let title = 'Confirm Action';
  export let message = 'Are you sure you want to proceed?';
  export let confirmText = 'Confirm';
  export let cancelText = 'Cancel';
  export let variant: 'danger' | 'primary' = 'primary';

  const dispatch = createEventDispatcher();

  function confirm() {
    dispatch('confirm');
    open = false;
  }

  function cancel() {
    dispatch('cancel');
    open = false;
  }

  function onBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) cancel();
  }

  $: if (typeof document !== 'undefined') {
    document.body.style.overflow = open ? 'hidden' : '';
  }
</script>

{#if open}
  <div
    class="fixed inset-0 z-50 overflow-y-auto"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    on:click={onBackdrop}
    on:keydown={(e) => e.key === 'Escape' && cancel()}
  >
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-xl ring-1 ring-black/5 overflow-hidden">
          <div class="p-6">
            <div class="flex items-start gap-4">
              {#if variant === 'danger'}
                <div class="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg class="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                </div>
              {:else}
                <div class="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4m0-4h.01"/>
                  </svg>
                </div>
              {/if}

              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-brand-richBlack mb-2">{title}</h3>
                <p class="text-sm text-brand-slateGray">{message}</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
            <button
              type="button"
              on:click={cancel}
              class="px-4 py-2 rounded-lg border border-admin-border bg-white text-brand-richBlack hover:bg-gray-50 transition font-medium"
            >
              {cancelText}
            </button>
            <button
              type="button"
              on:click={confirm}
              class="px-4 py-2 rounded-lg {variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-admin-blue hover:bg-admin-blue/90'} text-white transition font-medium"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
