<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { toastStore } from '$lib/stores/toast';
	import { browser } from '$app/environment';

	export let section: any;

	const dispatch = createEventDispatcher();
	let uploading = false;
	let fileInput: HTMLInputElement;

	// Ensure content is object with proper properties
	if (!section.content || typeof section.content !== 'object') {
		section.content = { logo_url: '', logo_alt: '' };
	}

	function handleChange() {
		dispatch('change', section);
	}

	async function handleFileUpload(event: Event) {
		if (!browser) return;

		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;

		// Validate file size (max 2MB)
		if (file.size > 2 * 1024 * 1024) {
			toastStore.push('Image size must be less than 2MB', 'error');
			return;
		}

		// Validate file type
		if (!file.type.startsWith('image/')) {
			toastStore.push('Please upload an image file', 'error');
			return;
		}

		uploading = true;

		try {
			// Get token from localStorage
			const token = localStorage.getItem('auth_token');
			if (!token) {
				throw new Error('Not authenticated');
			}

			const formData = new FormData();
			formData.append('image', file);
			formData.append('section_key', section.section_key);

			const response = await fetch('http://localhost:8000/api/v1/admin/page-content/upload-image', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Accept': 'application/json',
				},
				body: formData
			});

			if (!response.ok) {
				throw new Error('Upload failed');
			}

			const data = await response.json();

			if (data.success && data.data.url) {
				section.content.logo_url = data.data.url;
				handleChange();
				toastStore.push('Logo uploaded successfully', 'success');
			} else {
				throw new Error('Invalid response');
			}
		} catch (error) {
			console.error('Upload error:', error);
			toastStore.push('Failed to upload logo', 'error');
		} finally {
			uploading = false;
			// Reset file input
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

		{#if section.content.logo_url || section.image_url}
			<div class="mb-2 relative inline-block">
				<img
					src={section.content.logo_url || section.image_url}
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
				class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{uploading ? 'Uploading...' : 'Upload Logo'}
			</button>
			<input
				type="file"
				bind:this={fileInput}
				on:change={handleFileUpload}
				accept="image/*"
				class="hidden"
			/>
		</div>
		<p class="text-xs text-gray-500 mt-1">
			Upload a logo (max 2MB, JPG, PNG, GIF, WebP)
		</p>

		<div class="mt-3">
			<label for="logo_url" class="block text-xs font-medium text-gray-600 mb-1">
				Or enter logo URL manually
			</label>
			<input
				type="text"
				id="logo_url"
				bind:value={section.content.logo_url}
				on:input={handleChange}
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
				placeholder="https://example.com/logo.png"
			/>
		</div>
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
