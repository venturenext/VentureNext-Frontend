<script lang="ts">
  export let url: string = '';
  export let title: string = '';
  export let variant: 'group' | 'single' = 'group';
  export let label: string = 'Share';

  function openShare(u: string) {
    const w = 600, h = 500;
    const y = window.top?.outerHeight ? (window.top.outerHeight - h) / 2 : 0;
    const x = window.top?.outerWidth ? (window.top.outerWidth - w) / 2 : 0;
    window.open(u, '_blank', `toolbar=0,location=0,menubar=0,width=${w},height=${h},top=${y},left=${x}`);
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const twitter = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  async function webShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    } else {
      openShare(twitter);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      
    } catch {}
  }
</script>

{#if variant === 'single'}
  <button class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-brand-richBlack shadow-sm hover:bg-gray-50" on:click={webShare} aria-label={label}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49"/>
    </svg>
    <span class="text-sm font-medium">{label}</span>
  </button>
{:else}
  <div class="flex items-center gap-3">
    <button class="px-3 py-1.5 rounded bg-gray-100" on:click={webShare}>Share</button>
    <button class="px-3 py-1.5 rounded bg-gray-100" on:click={() => openShare(twitter)}>Twitter</button>
    <button class="px-3 py-1.5 rounded bg-gray-100" on:click={() => openShare(facebook)}>Facebook</button>
    <button class="px-3 py-1.5 rounded bg-gray-100" on:click={() => openShare(linkedin)}>LinkedIn</button>
    <button class="px-3 py-1.5 rounded bg-gray-100" on:click={copyLink}>Copy Link</button>
  </div>
{/if}
