<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let section: any;

  const dispatch = createEventDispatcher();

  if (!Array.isArray(section.content)) {
    section.content = [];
  }

  function emitChange() {
    section.content = [...section.content];
    dispatch('change', section);
  }

  function addItem() {
    section.content = [...section.content, { title: '', description: '' }];
    emitChange();
  }

  function removeItem(index: number) {
    section.content = section.content.filter((_: any, i: number) => i !== index);
    emitChange();
  }

  function moveItem(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= section.content.length) return;
    const clone = [...section.content];
    [clone[index], clone[target]] = [clone[target], clone[index]];
    section.content = clone;
    emitChange();
  }
</script>

<div class="space-y-4">
  <div class="border-t pt-2">
    <div class="flex justify-between items-center mb-4">
      <h4 class="font-medium text-gray-900">Section Items</h4>
      <button
        type="button"
        on:click={addItem}
        class="px-3 py-1 bg-brand-darkGreen text-white rounded-md hover:brightness-110 text-sm"
      >
        Add Section
      </button>
    </div>

    {#if section.content.length === 0}
      <p class="text-gray-500 text-sm italic">No items yet. Click "Add Section" to create one.</p>
    {/if}

    {#each section.content as item, index}
      <div class="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
        <div class="flex justify-between items-start mb-3">
          <h5 class="font-medium text-sm text-gray-700">Item {index + 1}</h5>
          <div class="flex gap-2">
            <button
              type="button"
              on:click={() => moveItem(index, -1)}
              disabled={index === 0}
              class="text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
              title="Move up"
            >
              Up
            </button>
            <button
              type="button"
              on:click={() => moveItem(index, 1)}
              disabled={index === section.content.length - 1}
              class="text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
              title="Move down"
            >
              Down
            </button>
            <button
              type="button"
              on:click={() => removeItem(index)}
              class="text-red-500 hover:text-red-700 text-xs"
              title="Remove"
            >
              Remove
            </button>
          </div>
        </div>

        <div class="space-y-3">
          <div>
            <label for={`title-${index}`} class="block text-xs font-medium text-gray-600 mb-1">Title</label>
            <input
              type="text"
              id={`title-${index}`}
              bind:value={item.title}
              on:input={emitChange}
              class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              placeholder="Enter title"
            />
          </div>

          <div>
            <label for={`description-${index}`} class="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea
              id={`description-${index}`}
              bind:value={item.description}
              on:input={emitChange}
              rows="3"
              class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              placeholder="Enter description"
            ></textarea>
          </div>
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
