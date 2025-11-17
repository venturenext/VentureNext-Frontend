<script lang="ts">
  export let label = '';
  export let type: string = 'text';
  export let name: string;
  export let value: string = '';
  export let placeholder = '';
  export let error: string | null = null;
  export let required = false;
</script>

<label class="block text-sm">
  <span class="text-gray-700">{label}{#if required}<span class="text-red-500">*</span>{/if}</span>
  <input {name} bind:value class="mt-1 block w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-darkGreen" {type} {placeholder} />
  {#if error}<div class="text-xs text-red-600 mt-1">{error}</div>{/if}
</label>

