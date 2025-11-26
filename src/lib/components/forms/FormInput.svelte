<script lang="ts">
  export let label = '';
  export let type: string = 'text';
  export let name: string;
  export let value: string = '';
  export let placeholder = '';
  export let error: string | null = null;
  export let required = false;
</script>

<label class="block space-y-2 text-sm text-brand-richBlack">
  <div class="flex items-center justify-between">
    <span class="font-medium">{label}{#if required}<span class="text-red-500">*</span>{/if}</span>
    {#if error}<span class="text-xs text-red-600">{error}</span>{/if}
  </div>
  <input
    {name}
    bind:value
    class="block w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-[15px] shadow-sm transition focus:border-brand-darkGreen focus:ring-4 focus:ring-brand-darkGreen/15"
    {type}
    {placeholder}
    aria-invalid={!!error}
    aria-required={required}
  />
</label>
