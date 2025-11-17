<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let section: any;

	const dispatch = createEventDispatcher();

	// Ensure content is object with proper properties
	if (!section.content || typeof section.content !== 'object') {
		section.content = { show_published: true, show_draft: false, limit: 6 };
	}
	if (section.content.show_published === undefined) section.content.show_published = true;
	if (section.content.show_draft === undefined) section.content.show_draft = false;
	if (!section.content.limit) section.content.limit = 6;

	function handleChange() {
		dispatch('change', section);
	}
</script>

<div class="space-y-4">
	<div>
		<label for="title" class="block text-sm font-medium text-gray-700 mb-1">
			Section Title
		</label>
		<input
			type="text"
			id="title"
			bind:value={section.title}
			on:input={handleChange}
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
			placeholder="Enter section title"
		/>
	</div>

	<div>
		<label for="subtitle" class="block text-sm font-medium text-gray-700 mb-1">
			Section Subtitle
		</label>
		<textarea
			id="subtitle"
			bind:value={section.subtitle}
			on:input={handleChange}
			rows="2"
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
			placeholder="Enter section subtitle"
		></textarea>
	</div>

	<div class="border-t pt-4">
		<h4 class="font-medium text-gray-900 mb-3">Display Settings</h4>

		<div class="space-y-3">
			<div class="flex items-center">
				<input
					type="checkbox"
					id="show_published"
					bind:checked={section.content.show_published}
					on:change={handleChange}
					class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
				/>
				<label for="show_published" class="ml-2 block text-sm text-gray-700">
					Show Published Items
				</label>
			</div>

			<div class="flex items-center">
				<input
					type="checkbox"
					id="show_draft"
					bind:checked={section.content.show_draft}
					on:change={handleChange}
					class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
				/>
				<label for="show_draft" class="ml-2 block text-sm text-gray-700">
					Show Draft Items
				</label>
			</div>

			<div>
				<label for="limit" class="block text-sm font-medium text-gray-700 mb-1">
					Number of Items to Display
				</label>
				<input
					type="number"
					id="limit"
					bind:value={section.content.limit}
					on:input={handleChange}
					min="1"
					max="20"
					class="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
				/>
			</div>
		</div>
	</div>

	<div class="flex items-center">
		<input
			type="checkbox"
			id="is_active"
			bind:checked={section.is_active}
			on:change={handleChange}
			class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
		/>
		<label for="is_active" class="ml-2 block text-sm text-gray-700">
			Active
		</label>
	</div>
</div>
