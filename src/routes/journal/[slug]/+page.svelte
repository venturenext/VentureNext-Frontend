<script>
  import SEOHead from '$lib/components/seo/SEOHead.svelte';
  import ShareButtons from '$lib/components/perks/ShareButtons.svelte';
  import { SITE_NAME } from '$lib/config';
  import { withAsset } from '$lib/utils/assets';
  export let data;
  const p = data.post;
  const title = p?.meta_title || p?.title || 'Article';
  const desc = p?.meta_description || p?.excerpt || '';
  function initial(name) { return (name || '?').trim().charAt(0).toUpperCase(); }
  const url = typeof window !== 'undefined' ? window.location.href : undefined;
</script>

<SEOHead title={`${title} | ${SITE_NAME}`} description={desc} url={url} image={withAsset(p?.og_image)} />

<section class="container-w py-10">
  <div class="max-w-3xl mx-auto">
    <div class="text-sm text-yellow-700 font-semibold mb-2">Article</div>
    <h1 class="text-3xl sm:text-4xl font-extrabold text-brand-richBlack">{p.title}</h1>
    <div class="mt-2 text-sm text-gray-500">{p.created_at?.slice(0,10)} • {p.reading_time || 5} min read</div>

    {#if p.author?.name}
      <div class="mt-4 flex items-center gap-3">
        {#if p.author?.avatar}
          <img src={withAsset(p.author.avatar)} alt={p.author.name} class="w-10 h-10 rounded-full object-cover" loading="lazy" />
        {:else}
          <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-brand-richBlack">{initial(p.author.name)}</div>
        {/if}
        <div>
          <div class="text-sm font-medium text-brand-richBlack">{p.author.name}</div>
          <div class="text-xs text-gray-500">Author</div>
        </div>
      </div>
    {/if}

    {#if p.og_image}
      <img class="mt-6 rounded-xl shadow-card" src={withAsset(p.og_image)} alt={p.title} />
    {/if}

    <article class="prose max-w-none mt-6">
      {@html p.content}
    </article>

    <div class="mt-8">
      <div class="text-sm font-semibold text-brand-richBlack mb-2">Share</div>
      <ShareButtons url={url} title={p.title} variant="single" label="Share Article" />
    </div>
  </div>
</section>
