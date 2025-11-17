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
  {#if keywords}<meta name="keywords" content={keywords} />{/if}
  {#if noindex}<meta name="robots" content="noindex, nofollow" />{/if}
  {#if url}<link rel="canonical" href={url} />{/if}
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  {#if image}<meta property="og:image" content={image} />{/if}
  {#if url}<meta property="og:url" content={url} />{/if}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  {#if image}<meta name="twitter:image" content={image} />{/if}
</svelte:head>
