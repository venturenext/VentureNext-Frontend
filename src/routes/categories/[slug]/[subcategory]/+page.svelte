<script lang="ts">
  import { SITE_NAME } from '$lib/config';
  import SEOHead from '$lib/components/seo/SEOHead.svelte';
  import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
  import StructuredData from '$lib/components/seo/StructuredData.svelte';
  import CategoryHeader from '$lib/components/categories/CategoryHeader.svelte';
  import SubcategoryTabs from '$lib/components/categories/SubcategoryTabs.svelte';
  import PerkGrid from '$lib/components/perks/PerkGrid.svelte';
  import PerkFilters from '$lib/components/perks/PerkFilters.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  export let data: any;
  const cat = data.category;
  const sub = data.subcategory;
  const title = sub?.meta_title || `${sub?.name || 'Subcategory'} | ${SITE_NAME}`;
  const desc = sub?.meta_description || `Explore perks under ${sub?.name || 'Subcategory'} in ${cat?.name || 'Category'} on ${SITE_NAME}.`;
</script>

<SEOHead title={title} description={desc} keywords={`${sub?.name}, ${cat?.name}, perks, discounts`} />
<StructuredData schema={{
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
    { '@type': 'ListItem', position: 2, name: 'Perks', item: '/perks' },
    { '@type': 'ListItem', position: 3, name: cat?.name || 'Category', item: `/categories/${cat?.slug}` },
    { '@type': 'ListItem', position: 4, name: sub?.name || 'Subcategory', item: `/categories/${cat?.slug}/${sub?.slug}` }
  ]
}} />

<section class="container-w py-8">
  <Breadcrumb items={[
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '/categories' },
    { label: cat?.name || 'Category', href: `/categories/${cat?.slug}` },
    { label: sub?.name || 'Subcategory' }
  ]} />
  <CategoryHeader name={cat?.name} description={cat?.description} icon={cat?.icon} />

  <div class="mt-6">
    <SubcategoryTabs categorySlug={cat?.slug} activeSub={sub?.slug} subcategories={cat?.subcategories || []} />
  </div>

  <div class="mt-6">
    <PerkFilters categories={data.categories} current={data.current} basePath={`/categories/${cat?.slug}/${sub?.slug}`} />
  </div>

  {#if data.perks && data.perks.length}
    <div class="mt-6">
      <PerkGrid items={data.perks} />
    </div>
  {:else}
    <div class="mt-6 bg-white rounded-xl shadow-card p-10 text-center">
      <div class="text-xl font-semibold text-brand-richBlack">No perks found</div>
      <p class="mt-2 text-sm text-brand-slateGray">Try adjusting your filters or search query.</p>
      <a href={`/categories/${cat?.slug}/${sub?.slug}`} class="inline-flex mt-4 px-4 py-2 rounded-full bg-gray-100 text-brand-richBlack">Reset Filters</a>
    </div>
  {/if}

  <Pagination meta={data.meta} current={data.current} basePath={`/categories/${cat?.slug}/${sub?.slug}`} />
</section>

