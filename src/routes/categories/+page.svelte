<script>
  import SEOHead from '$lib/components/seo/SEOHead.svelte';
  import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
  import { SITE_NAME } from '$lib/config';
  export let data;
</script>

<SEOHead title={`Categories | ${SITE_NAME}`} description="Browse perks by category and subcategory." />

<section class="container-w py-8">
  <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Categories' }]} />
  <h1 class="mt-2 text-3xl font-bold text-brand-richBlack">Categories</h1>
  <p class="text-sm text-brand-slateGray mt-1">Explore perks by category and subcategory.</p>

  <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
    {#each data.categories as c}
      <div class="bg-white rounded-xl shadow-card p-6">
        <div class="flex items-start gap-3">
          <div class="text-3xl" aria-hidden="true">{c.icon}</div>
          <div>
            <a href={`/categories/${c.slug}`} class="font-semibold text-brand-richBlack hover:underline">{c.name}</a>
            {#if c.description}<p class="text-sm text-brand-slateGray mt-1">{c.description}</p>{/if}
            {#if c.subcategories?.length}
              <div class="mt-3 flex flex-wrap gap-2">
                {#each c.subcategories as s}
                  <a href={`/categories/${c.slug}/${s.slug}`} class="px-3 py-1 rounded-full bg-gray-100 text-sm hover:bg-gray-200">{s.name}</a>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>
