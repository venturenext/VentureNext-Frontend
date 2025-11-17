<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { toastStore } from '$lib/stores/toast';
	import { browser } from '$app/environment';

	export let section: any;

	const dispatch = createEventDispatcher();
	let uploading = false;
	let fileInput: HTMLInputElement;

	function handleChange() {
		dispatch('change', section);
	}

	async function handleFileUpload(event: Event) {
		console.log('handleFileUpload called');
		if (!browser) {
			console.log('Not in browser');
			return;
		}

		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		console.log('File selected:', file?.name, file?.size, file?.type);

		if (!file) {
			console.log('No file selected');
			return;
		}

		// Validate file size (max 2MB)
		if (file.size > 2 * 1024 * 1024) {
			console.log('File too large:', file.size);
			toastStore.push('Image size must be less than 2MB', 'error');
			return;
		}

		// Validate file type
		if (!file.type.startsWith('image/')) {
			console.log('Invalid file type:', file.type);
			toastStore.push('Please upload an image file', 'error');
			return;
		}

		uploading = true;
		console.log('Starting upload, uploading flag:', uploading);

		try {
			// Get token from localStorage
			const token = localStorage.getItem('auth_token');
			console.log('Token found:', token ? 'Yes (length: ' + token.length + ')' : 'No');

			if (!token) {
				toastStore.push('Not authenticated. Please login again.', 'error');
				throw new Error('Not authenticated');
			}

			const formData = new FormData();
			formData.append('image', file);
			formData.append('section_key', section.section_key);

			console.log('Making fetch request to upload endpoint');
			console.log('Section key:', section.section_key);

			const response = await fetch('http://localhost:8000/api/v1/admin/page-content/upload-image', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Accept': 'application/json',
				},
				body: formData
			});

			console.log('Response received, status:', response.status);

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Upload failed, response:', errorText);
				toastStore.push('Upload failed: ' + response.status, 'error');
				throw new Error('Upload failed');
			}

			const data = await response.json();
			console.log('Upload response data:', data);

			if (data.success && data.data.url) {
				section.image_url = data.data.url;
				handleChange();
				toastStore.push('Image uploaded successfully', 'success');
			} else {
				throw new Error('Invalid response');
			}
		} catch (error) {
			console.error('Upload error:', error);
			toastStore.push('Failed to upload image: ' + (error as Error).message, 'error');
		} finally {
			uploading = false;
			console.log('Upload finished, uploading flag:', uploading);
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
				class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
			Upload an image (max 2MB, JPG, PNG, GIF, WebP)
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
