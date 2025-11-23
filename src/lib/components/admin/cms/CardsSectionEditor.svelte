<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let section: any;

	const dispatch = createEventDispatcher();
	const iconOptions = [
		{ label: 'None', value: '' },
		{ label: 'Bank', value: 'bank' },
		{ label: 'Search', value: 'search' },
		{ label: 'Gift', value: 'gift' },
		{ label: 'Eye', value: 'eye' },
		{ label: 'Rocket', value: 'rocket' },
		{ label: 'Star', value: 'star' },
		{ label: 'Check', value: 'check' },
		{ label: 'Mail', value: 'mail' },
		{ label: 'Chat', value: 'chat' },
		{ label: 'Shield', value: 'shield' },
		{ label: 'Chart', value: 'chart' },
		{ label: 'Calendar', value: 'calendar' }
	];


	if (!Array.isArray(section.content)) {
		section.content = [];
	}

	function handleChange() {
		dispatch('change', section);
	}

	function addCard() {
		section.content = [
			...section.content,
			{ icon: '', title: '', description: '' }
		];
		handleChange();
	}

	function removeCard(index: number) {
		section.content = section.content.filter((_: any, i: number) => i !== index);
		handleChange();
	}

	function moveCardUp(index: number) {
		if (index === 0) return;
		const temp = section.content[index];
		section.content[index] = section.content[index - 1];
		section.content[index - 1] = temp;
		section.content = [...section.content];
		handleChange();
	}

	function moveCardDown(index: number) {
		if (index === section.content.length - 1) return;
		const temp = section.content[index];
		section.content[index] = section.content[index + 1];
		section.content[index + 1] = temp;
		section.content = [...section.content];
		handleChange();
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
		<div class="flex justify-between items-center mb-4">
			<h4 class="font-medium text-gray-900">Cards</h4>
			<button
				type="button"
				on:click={addCard}
				class="px-3 py-1 bg-brand-darkGreen text-white rounded-md hover:brightness-110 text-sm"
			>
				Add Card
			</button>
		</div>

		{#if section.content.length === 0}
			<p class="text-gray-500 text-sm italic">No cards yet. Click "Add Card" to create one.</p>
		{/if}

		{#each section.content as card, index}
			<div class="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
				<div class="flex justify-between items-start mb-3">
					<h5 class="font-medium text-sm text-gray-700">Card {index + 1}</h5>
					<div class="flex gap-2">
						<button
							type="button"
							on:click={() => moveCardUp(index)}
							disabled={index === 0}
							class="text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
							title="Move up"
						>
							↑
						</button>
						<button
							type="button"
							on:click={() => moveCardDown(index)}
							disabled={index === section.content.length - 1}
							class="text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
							title="Move down"
						>
							↓
						</button>
						<button
							type="button"
							on:click={() => removeCard(index)}
							class="text-red-500 hover:text-red-700"
							title="Remove"
						>
							×
						</button>
					</div>
				</div>

				<div class="space-y-3">
					<div>
						<label for="icon-{index}" class="block text-xs font-medium text-gray-600 mb-1">
							Icon
						</label>
						<select
							id="icon-{index}"
							bind:value={card.icon}
							on:change={handleChange}
							class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
						>
							{#each iconOptions as opt}
								<option value={opt.value}>{opt.label}</option>
							{/each}
						</select>
						<p class="text-[11px] text-gray-500 mt-1">Choose an icon name (e.g., bank, search, gift). It will render on the landing page.</p>
					</div>

					<div>
						<label for="card-title-{index}" class="block text-xs font-medium text-gray-600 mb-1">
							Card Title
						</label>
						<input
							type="text"
							id="card-title-{index}"
							bind:value={card.title}
							on:input={handleChange}
							class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
							placeholder="Enter card title"
						/>
					</div>

					<div>
						<label for="card-desc-{index}" class="block text-xs font-medium text-gray-600 mb-1">
							Card Description
						</label>
						<textarea
							id="card-desc-{index}"
							bind:value={card.description}
							on:input={handleChange}
							rows="2"
							class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
							placeholder="Enter card description"
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
			on:change={handleChange}
			class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
		/>
		<label for="is_active" class="ml-2 block text-sm text-gray-700">
			Active
		</label>
	</div>
</div>
