<script lang="ts">
import { createEventDispatcher } from 'svelte';
import { toastStore } from '$lib/stores/toast';
import { browser } from '$app/environment';
import { deserialize } from '$app/forms';
import { withAsset } from '$lib/utils/assets';

	export let section: any;

const dispatch = createEventDispatcher();
let uploading = false;
let fileInput: HTMLInputElement;
const isTopbarLogo = section?.section_key === 'topbar_logo';


if (!section.content || typeof section.content !== 'object') {
	section.content = { logo_url: '', logo_alt: '' };
}

	function handleChange() {
		dispatch('change', section);
	}

	function handleLogoUrlInput(event: Event) {
		const value = (event.target as HTMLInputElement).value?.trim();
		if (isTopbarLogo && value && !value.toLowerCase().endsWith('.svg')) {
			toastStore.push('Top bar logo must be an SVG URL', 'error');
			return;
		}
		section.content.logo_url = value;
		handleChange();
	}

	async function handleFileUpload(event: Event) {
		if (!browser) return;

		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;

	
		if (file.size > 15 * 1024 * 1024) {
			toastStore.push('Image size must be less than 15MB', 'error');
			return;
		}

		
		if (isTopbarLogo) {
			const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
			if (!isSvg) {
				toastStore.push('Top bar logo must be an SVG file', 'error');
				return;
			}
		} else {
			if (!file.type.startsWith('image/')) {
				toastStore.push('Please upload an image file', 'error');
				return;
			}
		}

		uploading = true;

		try {
			const formData = new FormData();
			formData.append('image', file);
			formData.append('section_key', section.section_key);

		
			const response = await fetch('?/uploadImage', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Upload failed');
			}

			
			const responseText = await response.text();
			const result = deserialize(responseText);

			
			if (result.type === 'success' && result.data) {
				const uploadData = result.data as any;

				const imageUrl = uploadData.data?.url || uploadData.url;
				if (imageUrl) {
					section.content.logo_url = imageUrl;
					handleChange();
					toastStore.push('Logo uploaded successfully', 'success');
				} else {
					throw new Error('No URL in response');
				}
			} else if (result.type === 'failure') {
				const errorMessage = (result.data as any)?.error || 'Upload failed';
				throw new Error(errorMessage);
			} else {
				throw new Error('Upload failed');
			}
		} catch (error) {
			console.error('Upload error:', error);
			const errorMessage = error instanceof Error ? error.message : 'Failed to upload logo';
			toastStore.push(errorMessage, 'error');
		} finally {
			uploading = false;
		
			if (fileInput) fileInput.value = '';
		}
	}
</script>

<div class="space-y-4">
	<div>
		<label for="title" class="block text-sm font-medium text-gray-700 mb-1">
			Site Title
		</label>
		<input
			type="text"
			id="title"
			bind:value={section.title}
			on:input={handleChange}
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
			placeholder="Enter site title"
		/>
	</div>

	<div>
		<label for="logo" class="block text-sm font-medium text-gray-700 mb-1">
			Logo
		</label>

		{#if !isTopbarLogo && (section.content.logo_url || section.image_url)}
			<div class="mb-2 relative inline-block">
				<img
					src={withAsset(section.content.logo_url || section.image_url)}
					alt={section.content.logo_alt || 'Logo'}
					class="h-16 object-contain border border-gray-200 rounded-md p-2"
				/>
				<button
					type="button"
					on:click={() => { section.content.logo_url = ''; handleChange(); }}
					class="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg"
					title="Remove logo"
				>
					<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
					</svg>
				</button>
			</div>
		{/if}

		<div class="flex gap-2">
			<button
				type="button"
				on:click={() => fileInput.click()}
				disabled={uploading}
				class="px-4 py-2 bg-brand-darkGreen text-white rounded-md hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{uploading ? 'Uploading...' : 'Upload Logo'}
			</button>
			<input
				type="file"
				bind:this={fileInput}
				on:change={handleFileUpload}
				accept={isTopbarLogo ? 'image/svg+xml,.svg' : 'image/*'}
				class="hidden"
			/>
		</div>
		<p class="text-xs text-gray-500 mt-1">
			{isTopbarLogo
				? 'Upload an SVG (max 15MB). Preview is hidden; we only store the path.'
				: 'Upload a logo (max 15MB, JPG, PNG, GIF, WebP)'}
		</p>
	</div>

	<div class="mt-3">
		<label for="logo_url" class="block text-xs font-medium text-gray-600 mb-1">
			{isTopbarLogo ? 'SVG URL (required)' : 'Or enter logo URL manually'}
		</label>
		<input
			type="text"
			id="logo_url"
			value={section.content.logo_url}
			on:input={handleLogoUrlInput}
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
			placeholder={isTopbarLogo ? 'https://example.com/logo.svg' : 'https://example.com/logo.png'}
		/>
		{#if isTopbarLogo}
			<p class="text-xs text-gray-500 mt-1">Only SVG URL is allowed for the top bar logo.</p>
		{/if}
	</div>

	<div>
		<label for="logo_alt" class="block text-sm font-medium text-gray-700 mb-1">
			Logo Alt Text
		</label>
		<input
			type="text"
			id="logo_alt"
			bind:value={section.content.logo_alt}
			on:input={handleChange}
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
			placeholder="Enter logo alt text"
		/>
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
