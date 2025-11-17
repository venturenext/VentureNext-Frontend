<script lang="ts">
  export let loading = false;
  export let label = 'Submit';
</script>

<button type="submit" class="inline-flex items-center px-4 py-2 rounded bg-brand-darkGreen text-white disabled:opacity-60">
  {#if loading}
    <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  {/if}
  {label}
</button>

