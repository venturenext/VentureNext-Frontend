<script>
  import SEOHead from '$lib/components/seo/SEOHead.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import PartnerOfferModal from '$lib/components/forms/PartnerOfferModal.svelte';
  import CMSIcon from '$lib/components/CMSIcon.svelte';
  import { SITE_NAME, HERO_IMAGE } from '$lib/config';
  import { env } from '$env/dynamic/public';
  export let data;
  const sections = data?.sections || [];

  const getSection = (key) => sections.find((s) => s.section_key === key && s.is_active !== false);
  const hero = getSection('partner_hero');
  const whyPartner = getSection('partner_why_partner');
  const howItWorks = getSection('partner_how_it_works');
  const faq = getSection('partner_faq');

  let open = false;

  const assetBase = (env.PUBLIC_ASSET_BASE || '').replace(/\/$/, '');
  const withAsset = (path) => {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    const suffix = path.startsWith('/') ? path : `/${path}`;
    return `${assetBase}${suffix}`;
  };

  const whyPartnerCards = Array.isArray(whyPartner?.content) ? whyPartner.content : [];
  const howItWorksCards = Array.isArray(howItWorks?.content) ? howItWorks.content : [];
  const faqItems = Array.isArray(faq?.content) ? faq.content : [];
</script>

<SEOHead
  title={`Partner With Us | ${SITE_NAME}`}
  description={hero?.subtitle || ''}
/>

{#if hero && hero.title}
<!-- Hero -->
<section class="relative text-white overflow-hidden">
  {#if hero.image_url}
    <div class="absolute inset-0 bg-center bg-cover" style={`background-image: url('${withAsset(hero.image_url) || HERO_IMAGE}')`} aria-hidden="true"></div>
  {/if}
  <div class="absolute inset-0 bg-brand-darkGreen/80"></div>
  <div class="container-w py-20 relative">
    <h1 class="text-4xl sm:text-5xl font-extrabold">{hero.title}</h1>
    {#if hero.subtitle}
      <p class="mt-3 max-w-2xl text-white/85">{hero.subtitle}</p>
    {/if}
    <button class="mt-6 inline-flex px-5 py-3 rounded-md bg-yellow-400 text-brand-richBlack font-semibold hover:bg-yellow-500" on:click={() => (open = true)}>Get started</button>
  </div>
</section>
{/if}

{#if whyPartner && whyPartnerCards.length > 0}
<!-- Why partner -->
<section class="container-w py-16">
  {#if whyPartner.title}
    <h2 class="text-3xl font-bold text-center text-brand-richBlack">{whyPartner.title}</h2>
  {/if}
  {#if whyPartner.subtitle}
    <p class="mt-2 text-center text-brand-slateGray">{whyPartner.subtitle}</p>
  {/if}
  <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
    {#each whyPartnerCards as card}
      <div class="rounded-2xl bg-white p-6 shadow-card border border-gray-100">
        <div class="flex items-start gap-4">
          {#if card.icon}
            <div
              class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-brand-richBlack/70 border border-gray-200 shadow-[0_8px_18px_-10px_rgba(0,0,0,0.35)]"
              aria-hidden="true"
            >
              <CMSIcon name={card.icon} size="24" />
            </div>
          {/if}
          <div class="space-y-1">
            <div class="font-semibold text-brand-richBlack leading-snug">{card.title}</div>
            <p class="text-sm text-brand-slateGray leading-relaxed">{card.description}</p>
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>
{/if}

{#if howItWorks && howItWorksCards.length > 0}
<!-- How it works -->
<section class="container-w py-12">
  {#if howItWorks.title}
    <h2 class="text-3xl font-bold text-center text-brand-richBlack">{howItWorks.title}</h2>
  {/if}
  <div class="mt-8 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
    {#each howItWorksCards as card}
      <div class="bg-white rounded-xl shadow-card p-6 text-center">
        {#if card.icon}
          <div class="mx-auto w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-xl" aria-hidden="true">
            <CMSIcon name={card.icon} size="22" />
          </div>
        {/if}
        <div class="mt-3 font-semibold">{card.title}</div>
        <p class="mt-1 text-sm text-brand-slateGray">{card.description}</p>
      </div>
    {/each}
  </div>
</section>
{/if}

{#if faq && faqItems.length > 0}
<!-- FAQ -->
<section class="bg-yellow-50 py-12">
  <div class="container-w max-w-3xl">
    {#if faq.title}
      <h2 class="text-3xl font-bold text-center text-brand-richBlack">{faq.title}</h2>
    {/if}
    <div class="mt-6 divide-y bg-white rounded-xl shadow-card">
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
  </div>
</section>
{/if}

<Modal bind:open title={null} size="lg" on:close={() => (open = false)}>
  <PartnerOfferModal on:close={() => (open = false)} onSuccess={() => (open = false)} />
</Modal>
