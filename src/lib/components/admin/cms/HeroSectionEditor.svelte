<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { toastStore } from '$lib/stores/toast';
	import { browser } from '$app/environment';
	import { deserialize } from '$app/forms';

export let section: any;

const dispatch = createEventDispatcher();
let uploading = false;
let fileInput: HTMLInputElement;

// Ensure content object exists for extra fields like contact email
if (!section.content || typeof section.content !== 'object') {
	section.content = {};
}
if (section.section_key === 'contact_hero' && section.content.email === undefined) {
	section.content.email = '';
}

	function handleChange() {
		dispatch('change', section);
	}

	async function handleFileUpload(event: Event) {
		if (!browser) return;

		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;

		// Validate file size (max 15MB)
		if (file.size > 15 * 1024 * 1024) {
			toastStore.push('Image size must be less than 15MB', 'error');
			return;
		}

		// Validate file type
		if (!file.type.startsWith('image/')) {
			toastStore.push('Please upload an image file', 'error');
			return;
		}

		uploading = true;

		try {
			const formData = new FormData();
			formData.append('image', file);
			formData.append('section_key', section.section_key);

			// Use SvelteKit form action instead of direct API call
			const response = await fetch('/admin/content?/uploadImage', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				toastStore.push('Upload failed', 'error');
				throw new Error('Upload failed');
			}

			// Use SvelteKit's deserialize to properly parse the form action response
			const responseText = await response.text();
			const result = deserialize(responseText);

			// SvelteKit form action response format
			if (result.type === 'success' && result.data) {
				const uploadData = result.data as any;

				// The response.data contains the Laravel API response
				// which has { url: '...', path: '...' }
				const imageUrl = uploadData.url || uploadData.data?.url;
				if (imageUrl) {
					section.image_url = imageUrl;
					handleChange();
					toastStore.push('Image uploaded successfully', 'success');
				} else {
					throw new Error('No URL in response');
				}
			} else {
				throw new Error('Invalid response');
			}
		} catch (error) {
			console.error('Upload error:', error);
			toastStore.push('Failed to upload image', 'error');
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
			Title
		</label>
		<input
			type="text"
			id="title"
			bind:value={section.title}
			on:input={handleChange}
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
			placeholder="Enter title"
		/>
	</div>

	<div>
		<label for="subtitle" class="block text-sm font-medium text-gray-700 mb-1">
			Subtitle
		</label>
		<textarea
			id="subtitle"
			bind:value={section.subtitle}
			on:input={handleChange}
			rows="3"
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
			placeholder="Enter subtitle"
		></textarea>
	</div>

	<!-- SEO Fields -->
	<div class="border-t border-gray-200 pt-4 mt-4">
		<h4 class="text-sm font-semibold text-gray-700 mb-3">SEO Settings</h4>

		<div class="space-y-4">
			<div>
				<label for="meta_title" class="block text-sm font-medium text-gray-700 mb-1">
					Meta Title
				</label>
				<input
					type="text"
					id="meta_title"
					bind:value={section.meta_title}
					on:input={handleChange}
					maxlength="255"
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
					placeholder="SEO title for search engines"
				/>
				<p class="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
			</div>

			<div>
				<label for="meta_description" class="block text-sm font-medium text-gray-700 mb-1">
					Meta Description
				</label>
				<textarea
					id="meta_description"
					bind:value={section.meta_description}
					on:input={handleChange}
					rows="2"
					maxlength="500"
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
					placeholder="Brief description for search results"
				></textarea>
				<p class="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
			</div>

			<div>
				<label for="meta_keywords" class="block text-sm font-medium text-gray-700 mb-1">
					Meta Keywords
				</label>
				<input
					type="text"
					id="meta_keywords"
					bind:value={section.meta_keywords}
					on:input={handleChange}
					maxlength="255"
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
					placeholder="keyword1, keyword2, keyword3"
				/>
				<p class="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
			</div>
		</div>
	</div>

	{#if section.section_key === 'contact_hero'}
		<div>
			<label for="contact_email" class="block text-sm font-medium text-gray-700 mb-1">
				Contact Email
			</label>
			<input
				type="email"
				id="contact_email"
				bind:value={section.content.email}
				on:input={handleChange}
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
				placeholder="contact@example.com"
			/>
		</div>
	{/if}

	{#if section.section_key !== 'perks_hero' && section.section_key !== 'journal_hero'}
		<div>
			<label for="image" class="block text-sm font-medium text-gray-700 mb-1">
				Background Image
			</label>

			{#if section.image_url}
				<div class="mb-2 relative">
					<img
						src={section.image_url}
						alt="Hero background"
						class="w-full h-48 object-cover rounded-md"
					/>
					<button
						type="button"
						on:click={() => { section.image_url = ''; handleChange(); }}
						class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"
						title="Remove image"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
				{uploading ? 'Uploading...' : 'Upload Image'}
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
				Upload an image (max 15MB, JPG, PNG, GIF, WebP)
			</p>

			<div class="mt-3">
				<label for="image_url" class="block text-xs font-medium text-gray-600 mb-1">
					Or enter image URL manually
				</label>
				<input
					type="text"
					id="image_url"
					bind:value={section.image_url}
					on:input={handleChange}
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
					placeholder="https://example.com/image.jpg"
				/>
			</div>
		</div>
	{/if}

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
