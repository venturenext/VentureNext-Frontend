<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let section: any;
  const dispatch = createEventDispatcher();

  if (!Array.isArray(section.content) || section.content.length === 0) {
    section.content = [{ label: 'List Your Perks', href: '/partner' }];
  }

  const cta = section.content[0];

  function emitChange() {
    section.content = [cta];
    dispatch('change', section);
  }
</script>

<div class="space-y-4">
  <div class="border-t pt-3 space-y-3">
    <div>
      <label for="cta-label" class="block text-xs font-medium text-gray-600 mb-1">CTA Label</label>
      <input
        id="cta-label"
        type="text"
        bind:value={cta.label}
        on:input={emitChange}
        class="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
        placeholder="List Your Perks"
      />
    </div>
    <div>
      <label for="cta-url" class="block text-xs font-medium text-gray-600 mb-1">CTA URL</label>
      <input
        id="cta-url"
        type="text"
        bind:value={cta.href}
        on:input={emitChange}
        class="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
        placeholder="/partner"
      />
    </div>
  </div>

  <div class="flex items-center">
    <input
      type="checkbox"
      id="is_active"
      bind:checked={section.is_active}
      on:change={emitChange}
      class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
    />
    <label for="is_active" class="ml-2 block text-sm text-gray-700">Active</label>
  </div>
</div>
