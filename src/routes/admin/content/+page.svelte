<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { toastStore } from '$lib/stores/toast';
	import HeroSectionEditor from '$lib/components/admin/cms/HeroSectionEditor.svelte';
	import CardsSectionEditor from '$lib/components/admin/cms/CardsSectionEditor.svelte';
	import FAQSectionEditor from '$lib/components/admin/cms/FAQSectionEditor.svelte';
	import TermsSectionEditor from '$lib/components/admin/cms/TermsSectionEditor.svelte';
	import ContentSectionEditor from '$lib/components/admin/cms/ContentSectionEditor.svelte';
	import ListSettingsSectionEditor from '$lib/components/admin/cms/ListSettingsSectionEditor.svelte';
	import LogoTitleSectionEditor from '$lib/components/admin/cms/LogoTitleSectionEditor.svelte';
	import LinkListSectionEditor from '$lib/components/admin/cms/LinkListSectionEditor.svelte';
	import FooterLinksSectionEditor from '$lib/components/admin/cms/FooterLinksSectionEditor.svelte';
	import TopbarCtaEditor from '$lib/components/admin/cms/TopbarCtaEditor.svelte';

	export let data;
	export let form;

	let hasChanges = false;
	let saving = false;
	let baseline = '';

	// Reactive variables that update when data changes
	$: pages = data.pages || [];
	let selectedPageName = data.selectedPage || 'homepage';
	$: if (data.selectedPage && data.selectedPage !== selectedPageName) {
		selectedPageName = data.selectedPage;
	}
	$: selectedPage = pages.find((p: any) => p.name === selectedPageName);

	// Deep clone sections when data changes and reset hasChanges
	let sections: any[] = [];
	let lastDataSections: any[] = [];
	$: {
		// Only rebuild sections if the actual data from server has changed (not from user edits)
		const currentDataSections = data.sections || [];
		const dataChanged = JSON.stringify(currentDataSections) !== JSON.stringify(lastDataSections);

		if (dataChanged) {
			lastDataSections = JSON.parse(JSON.stringify(currentDataSections));
			const rawSections = JSON.parse(JSON.stringify(currentDataSections));
			sections = buildSections(selectedPage, rawSections);
			baseline = JSON.stringify(sections);
			hasChanges = false;
		}
	}

	// Handle form submission result
	$: if (form?.success) {
		toastStore.push('Content saved successfully', 'success');
		hasChanges = false;
	} else if (form?.error) {
		toastStore.push(form.error, 'error');
	}

	function handleSectionChange() {
		// Force a shallow array update so Svelte tracks mutations
		sections = [...sections];
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
			// Use SvelteKit action endpoint on the same route
			const response = await fetch('?/bulkUpdate', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				toastStore.push('Content saved successfully', 'success');
				baseline = JSON.stringify(sections);
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

	async function handlePageChange(name: string) {
		if (!name || name === selectedPageName) return;
		await goto(`/admin/content?page=${name}`, { replaceState: true, keepFocus: true });
	}

	function buildDefaultContentForType(type: string) {
		if (type === 'cards') return [];
		if (type === 'faq') return [];
		if (type === 'list_settings') return { show_published: true, show_draft: false, limit: 6 };
		if (type === 'logo_title') return { logo_url: '', logo_alt: '' };
		if (type === 'links') return [];
		if (type === 'content') return { html: '' };
		if (type === 'terms') return [];
		return {};
	}

	function buildSections(pageDef: any, rawSections: any[]) {
		if (!pageDef) return rawSections;
		const byKey = new Map(rawSections.map((s) => [s.section_key, s]));
		const built = (pageDef.sections || []).map((s: any, idx: number) => {
			const existing = byKey.get(s.key);
			if (existing) return existing;
			return {
				page_name: pageDef.name,
				section_type: s.type,
				section_key: s.key,
				title: '',
				subtitle: '',
				content: buildDefaultContentForType(s.type),
				image_url: '',
				display_order: idx,
				is_active: true
			};
		});
		return built.length ? built : rawSections;
	}
</script>

<svelte:head>
	<title>Content Management - PerkPal Admin</title>
</svelte:head>

<div class="max-w-7xl mx-auto page-grid">
	<!-- Header -->
	<div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Content Management</h1>
			<p class="mt-2 text-gray-600">Manage content for every public page.</p>
		</div>

		<button
			type="button"
			on:click={handleSave}
			disabled={saving}
			class="px-6 py-2 bg-brand-darkGreen text-white rounded-md hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
		>
			{saving ? 'Saving...' : 'Save Changes'}
		</button>
	</div>

	<!-- Main Content - Section Editors -->
	<div class="space-y-4">
		{#if selectedPage}
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<div class="space-y-6">
					<h2 class="text-2xl font-bold text-gray-900 mb-1">{selectedPage.label}</h2>
					<p class="text-gray-600 text-sm">
						Edit content sections for this page
					</p>

					{#if sections.length === 0}
						<p class="text-gray-500 italic">No sections found for this page.</p>
					{:else}
						<div class="space-y-8">
							{#each sections as section, index}
								<div class="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
									<h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
										<span class="w-6 h-6 rounded-full bg-green-100 text-green-700 text-sm flex items-center justify-center">
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
									{:else if section.section_type === 'terms' || section.section_key === 'terms_sections'}
										<TermsSectionEditor
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
									{:else if section.section_type === 'links'}
										{#if section.section_key === 'topbar_cta'}
											<TopbarCtaEditor
												bind:section={sections[index]}
												on:change={handleSectionChange}
											/>
										{:else if section.page_name === 'footer'}
											<FooterLinksSectionEditor
												bind:section={sections[index]}
												on:change={handleSectionChange}
											/>
										{:else}
											<LinkListSectionEditor
												bind:section={sections[index]}
												on:change={handleSectionChange}
											/>
										{/if}
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
			</div>
		{/if}
	</div>
</div>

<style>
	/* Add spacing at the bottom for mobile save button */
	.page-grid {
		padding-bottom: 80px;
	}

	@media (min-width: 1024px) {
		.page-grid {
			padding-bottom: 0;
		}
	}
</style>
