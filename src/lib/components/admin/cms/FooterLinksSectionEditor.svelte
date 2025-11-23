<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let section: any;
  const dispatch = createEventDispatcher();

  if (!Array.isArray(section.content)) {
    section.content = [];
  }

  const isSocial = section.section_key === 'footer_social_links';
  const heading = isSocial ? 'Social Links' : 'Navigation Links';
  const iconOptions = [
    { label: 'None', value: '' },
    { label: 'Twitter', value: 'twitter' },
    { label: 'Instagram', value: 'instagram' },
    { label: 'LinkedIn', value: 'linkedin' },
    { label: 'Facebook', value: 'facebook' },
    { label: 'YouTube', value: 'youtube' },
    { label: 'TikTok', value: 'tiktok' },
    { label: 'GitHub', value: 'github' }
  ];

  function emitChange() {
    section.content = [...section.content];
    dispatch('change', section);
  }

  function addLink() {
    section.content = [...section.content, { label: '', href: '' }];
    emitChange();
  }

  function removeLink(index: number) {
    section.content = section.content.filter((_: any, i: number) => i !== index);
    emitChange();
  }

  function moveLink(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= section.content.length) return;
    const next = [...section.content];
    [next[index], next[target]] = [next[target], next[index]];
    section.content = next;
    emitChange();
  }
</script>

<div class="space-y-4">
  <div class="border-t pt-3">
    <div class="flex items-center justify-between mb-3">
      <h4 class="font-medium text-gray-900">{heading}</h4>
      <button
        type="button"
        on:click={addLink}
        class="px-3 py-1 bg-brand-darkGreen text-white rounded-md text-sm hover:brightness-110"
      >
        Add Link
      </button>
    </div>

    {#if section.content.length === 0}
      <p class="text-gray-500 text-sm italic">No links yet. Click "Add Link" to start.</p>
    {/if}

    {#each section.content as link, index}
      <div class="mb-3 rounded-md border border-gray-200 bg-gray-50 p-3">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Link {index + 1}</span>
          <div class="flex gap-2">
            <button type="button" on:click={() => moveLink(index, -1)} class="text-gray-500 hover:text-gray-700" aria-label="Move up">
              ?
            </button>
            <button type="button" on:click={() => moveLink(index, 1)} class="text-gray-500 hover:text-gray-700" aria-label="Move down">
              ?
            </button>
            <button type="button" on:click={() => removeLink(index)} class="text-red-500 hover:text-red-700 text-sm" aria-label="Remove link">
              Remove
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-{isSocial ? 3 : 2} gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Label</label>
            <input
              type="text"
              bind:value={link.label}
              on:input={emitChange}
              class="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
              placeholder={isSocial ? 'Twitter' : 'About'}
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">URL</label>
            <input
              type="text"
              bind:value={link.href}
              on:input={emitChange}
              class="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
              placeholder={isSocial ? 'https://twitter.com/yourprofile' : '/about'}
            />
          </div>
          {#if isSocial}
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Icon</label>
              <select
                bind:value={link.icon}
                on:change={emitChange}
                class="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
              >
                {#each iconOptions as opt}
                  <option value={opt.value}>{opt.label}</option>
                {/each}
              </select>
              <p class="text-[11px] text-gray-500 mt-1">Pilih ikon sosial (twitter/instagram/linkedin/etc). Ikon akan tampil di footer.</p>
            </div>
          {/if}
        </div>
      </div>
    {/each}
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
