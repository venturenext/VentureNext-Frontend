<script lang="ts">
  import SEOHead from '$lib/components/seo/SEOHead.svelte';
  import { SITE_NAME, HERO_IMAGE } from '$lib/config';

  export let data;
  const sections = data?.sections || [];

  const getSection = (key: string) => sections.find((s: any) => s.section_key === key && s.is_active !== false);

  const hero = getSection('about_hero');
  const whatWeDo = getSection('about_what_we_do');
  const whoWeServe = getSection('about_who_we_serve');
  const faq = getSection('about_faq');

  const whatWeDoCards = Array.isArray(whatWeDo?.content) ? whatWeDo.content : [];
  const whoWeServeCards = Array.isArray(whoWeServe?.content) ? whoWeServe.content : [];
  const faqItems = Array.isArray(faq?.content) ? faq.content : [];
</script>

<SEOHead title={`About | ${SITE_NAME}`} description={hero?.subtitle || ''} />

{#if hero && hero.title}
<!-- Hero -->
<section class="relative">
  {#if hero.image_url}
    <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('{hero.image_url}')" aria-hidden="true"></div>
  {/if}
  <div class="absolute inset-0 bg-brand-darkGreen/80"></div>
  <div class="relative container-w py-24 text-white">
    <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight">{hero.title}</h1>
    {#if hero.subtitle}
      <p class="mt-4 max-w-3xl text-white/85">{hero.subtitle}</p>
    {/if}
  </div>
  <div class="sr-only" aria-hidden="true"></div>
</section>
{/if}

{#if whatWeDo && whatWeDoCards.length > 0}
<!-- What We Do -->
<section class="container-w py-16">
  {#if whatWeDo.title}
    <h2 class="text-2xl sm:text-3xl font-bold text-center text-brand-richBlack">{whatWeDo.title}</h2>
  {/if}
  {#if whatWeDo.subtitle}
    <p class="mt-3 max-w-2xl mx-auto text-center text-brand-slateGray">{whatWeDo.subtitle}</p>
  {/if}

  <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
    {#each whatWeDoCards as card}
      <div class="rounded-xl bg-white p-6 shadow-card">
        {#if card.icon}
          <div class="text-3xl" aria-hidden="true">{card.icon}</div>
        {/if}
        <div class="mt-4 font-semibold text-brand-richBlack">{card.title}</div>
        <p class="mt-1 text-sm text-brand-slateGray">{card.description}</p>
      </div>
    {/each}
  </div>
</section>
{/if}

{#if whoWeServe && whoWeServeCards.length > 0}
<!-- Who We Serve -->
<section class="py-16 bg-gray-50">
  <div class="container-w">
    {#if whoWeServe.title}
      <h2 class="text-2xl sm:text-3xl font-bold text-center text-brand-richBlack">{whoWeServe.title}</h2>
    {/if}
    {#if whoWeServe.subtitle}
      <p class="mt-3 max-w-3xl mx-auto text-center text-brand-slateGray">{whoWeServe.subtitle}</p>
    {/if}

    <div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      {#each whoWeServeCards as card}
        <div class="bg-white rounded-xl p-6 shadow-card text-center">
          {#if card.icon}
            <div class="mx-auto w-10 h-10 rounded-md bg-yellow-400 flex items-center justify-center text-brand-richBlack text-xl" aria-hidden="true">{card.icon}</div>
          {/if}
          <div class="mt-3 font-semibold text-brand-richBlack">{card.title}</div>
          <p class="mt-1 text-sm text-brand-slateGray">{card.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>
{/if}

{#if faq && faqItems.length > 0}
<!-- FAQ -->
<section class="container-w py-16">
  {#if faq.title}
    <h2 class="text-2xl sm:text-3xl font-bold text-center text-brand-richBlack">{faq.title}</h2>
  {/if}
  {#if faq.subtitle}
    <p class="mt-3 max-w-2xl mx-auto text-center text-brand-slateGray">{faq.subtitle}</p>
  {/if}

  <div class="mt-8 divide-y rounded-xl bg-white shadow-card">
    {#each faqItems as item}
      <details class="group p-4 open:bg-gray-50">
        <summary class="flex items-center justify-between cursor-pointer list-none" aria-label={`${item.question || item.q} - Click to expand`}>
          <span class="font-medium text-brand-richBlack">{item.question || item.q}</span>
          <span class="ml-4 text-brand-richBlack group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
        </summary>
        <p class="mt-2 text-sm text-brand-slateGray">{item.answer || item.a}</p>
      </details>
    {/each}
  </div>
</section>
{/if}
