<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { toastStore } from '$lib/stores/toast';
	import HeroSectionEditor from '$lib/components/admin/cms/HeroSectionEditor.svelte';
	import CardsSectionEditor from '$lib/components/admin/cms/CardsSectionEditor.svelte';
	import FAQSectionEditor from '$lib/components/admin/cms/FAQSectionEditor.svelte';
	import ContentSectionEditor from '$lib/components/admin/cms/ContentSectionEditor.svelte';
	import ListSettingsSectionEditor from '$lib/components/admin/cms/ListSettingsSectionEditor.svelte';
	import LogoTitleSectionEditor from '$lib/components/admin/cms/LogoTitleSectionEditor.svelte';

	export let data;
	export let form;

	let hasChanges = false;
	let saving = false;

	// Reactive variables that update when data changes
	$: pages = data.pages || [];
	$: selectedPageName = data.selectedPage || 'homepage';
	$: selectedPage = pages.find((p: any) => p.name === selectedPageName);

	// Deep clone sections when data changes and reset hasChanges
	let sections: any[] = [];
	$: {
		sections = JSON.parse(JSON.stringify(data.sections || []));
		hasChanges = false;
	}

	// Handle form submission result
	$: if (form?.success) {
		toastStore.push('Content saved successfully', 'success');
		hasChanges = false;
	} else if (form?.error) {
		toastStore.push(form.error, 'error');
	}

	function handleSectionChange() {
		hasChanges = true;
	}

	async function handleSave() {
		if (!hasChanges) {
			toastStore.push('No changes to save', 'info');
			return;
		}

		saving = true;
		const formData = new FormData();
		formData.append('sections', JSON.stringify(sections));

		try {
			const response = await fetch('/admin/content?/bulkUpdate', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				toastStore.push('Content saved successfully', 'success');
				hasChanges = false;
				await invalidateAll();
			} else {
				toastStore.push('Failed to save content', 'error');
			}
		} catch (error) {
			toastStore.push('Failed to save content', 'error');
			console.error('Save error:', error);
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>Content Management - PerkPal Admin</title>
</svelte:head>

<div class="max-w-7xl mx-auto">
	<!-- Header -->
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Content Management</h1>
			<p class="mt-2 text-gray-600">
				Manage content for all pages from a unified interface
			</p>
		</div>

		{#if hasChanges}
			<button
				type="button"
				on:click={handleSave}
				disabled={saving}
				class="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
			>
				{saving ? 'Saving...' : 'Save Changes'}
			</button>
		{/if}
	</div>

	<div>
		<!-- Main Content - Section Editors -->
		<div>
			{#if selectedPage}
				<div class="space-y-6">
					<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 class="text-2xl font-bold text-gray-900 mb-1">{selectedPage.label}</h2>
						<p class="text-gray-600 text-sm mb-6">
							Edit content sections for this page
						</p>

						{#if sections.length === 0}
							<p class="text-gray-500 italic">No sections found for this page.</p>
						{:else}
							<div class="space-y-8">
								{#each sections as section, index}
									<div class="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
										<h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
											<span class="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-sm flex items-center justify-center">
												{index + 1}
											</span>
											{selectedPage.sections?.find((s: any) => s.key === section.section_key)
												?.label || section.section_key}
										</h3>

										{#if section.section_type === 'hero'}
											<HeroSectionEditor
												bind:section={sections[index]}
												on:change={handleSectionChange}
											/>
										{:else if section.section_type === 'cards'}
											<CardsSectionEditor
												bind:section={sections[index]}
												on:change={handleSectionChange}
											/>
										{:else if section.section_type === 'faq'}
											<FAQSectionEditor
												bind:section={sections[index]}
												on:change={handleSectionChange}
											/>
										{:else if section.section_type === 'content'}
											<ContentSectionEditor
												bind:section={sections[index]}
												on:change={handleSectionChange}
											/>
										{:else if section.section_type === 'list_settings'}
											<ListSettingsSectionEditor
												bind:section={sections[index]}
												on:change={handleSectionChange}
											/>
										{:else if section.section_type === 'logo_title'}
											<LogoTitleSectionEditor
												bind:section={sections[index]}
												on:change={handleSectionChange}
											/>
										{:else}
											<p class="text-gray-500 italic">
												Unknown section type: {section.section_type}
											</p>
										{/if}
									</div>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Save Button (Fixed at bottom on mobile) -->
					<div class="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
						{#if hasChanges}
							<button
								type="button"
								on:click={handleSave}
								disabled={saving}
								class="w-full px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
							>
								{saving ? 'Saving...' : 'Save Changes'}
							</button>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	/* Add some spacing at the bottom for mobile save button */
	@media (max-width: 1024px) {
		.lg\:col-span-3 {
			padding-bottom: 80px;
		}
	}
</style>
