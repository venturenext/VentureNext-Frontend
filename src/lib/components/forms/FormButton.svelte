<script lang="ts">
  export let loading = false;
  export let label = 'Submit';
  export let fullWidth = true;
  export let variant: 'primary' | 'yellow' = 'primary';

  const VARIANT_STYLES = {
    primary: 'bg-gradient-to-r from-brand-darkGreen to-emerald-600 text-white shadow-emerald-900/15',
    yellow: 'bg-amber-400 text-amber-900 shadow-amber-500/30 hover:bg-amber-500'
  };

  $: variantClass = VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary;
</script>

<button
  type="submit"
  class={`relative inline-flex items-center justify-center px-4 py-3 rounded-xl font-semibold shadow-lg transition hover:translate-y-px hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed ${variantClass} ${fullWidth ? 'w-full' : ''}`}
>
  {#if loading}
    <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  {/if}
  {label}
</button>
