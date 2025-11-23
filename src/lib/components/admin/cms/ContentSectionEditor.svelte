<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let section: any;

	const dispatch = createEventDispatcher();


	if (!section.content || typeof section.content !== 'object') {
		section.content = { html: '' };
	}
	if (!section.content.html) {
		section.content.html = '';
	}

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
		<label for="content" class="block text-sm font-medium text-gray-700 mb-1">
			Content (HTML)
		</label>
		<textarea
			id="content"
			bind:value={section.content.html}
			on:input={handleChange}
			rows="15"
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
			placeholder="Enter HTML content..."
		></textarea>
		<p class="text-xs text-gray-500 mt-1">
			You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;ol&gt;, etc.
		</p>
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
