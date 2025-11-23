<script lang="ts">
  import { SITE_NAME } from '$lib/config';
  export let title = SITE_NAME;
  export let description = 'Your gateway to exclusive perks and deals.';
  export let url: string | undefined = undefined;
  export let image: string | undefined = undefined;
  export let keywords: string | undefined = undefined;
  export let noindex: boolean = false;
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords || ''} />
  <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
  <link rel="canonical" href={url || ''} />

  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image || ''} />
  <meta property="og:url" content={url || ''} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image || ''} />
</svelte:head>
