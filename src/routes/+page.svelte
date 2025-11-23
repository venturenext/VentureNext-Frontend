<script>
  export let data;
  const journal = data?.journal || [];
  const latestPerks = data?.latestPerks || [];
  const cmsSections = data?.sections || [];
  import SEOHead from '$lib/components/seo/SEOHead.svelte';
  import CMSIcon from '$lib/components/CMSIcon.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import PerkCard from '$lib/components/perks/PerkCard.svelte';
  import { HERO_IMAGE, SITE_NAME, PERK_PLACEHOLDER } from '$lib/config';
  import { withAsset } from '$lib/utils/assets';

  const getSection = (key) => cmsSections.find((s) => s.section_key === key && s.is_active !== false);

  const hero = getSection('homepage_hero');
  const howItWorks = getSection('homepage_how_it_works');
  const latestPerksSection = getSection('homepage_latest_perks');
  const journalSection = getSection('homepage_journal');

  const heroTitle = hero?.title || '';
  const heroSubtitle = hero?.subtitle || '';
  const heroImage = withAsset(hero?.image_url) || HERO_IMAGE;
  const heroChips = Array.isArray(hero?.content) ? hero.content : [];

  const howItWorksCards = Array.isArray(howItWorks?.content) ? howItWorks.content : [];

  const latestPerksTitle = latestPerksSection?.title || '';
  const latestPerksSubtitle = latestPerksSection?.subtitle || '';
  const journalTitle = journalSection?.title || '';
  const journalSubtitle = journalSection?.subtitle || '';
</script>

<SEOHead title={`${SITE_NAME} — Exclusive Perks`} description={heroSubtitle} />

{#if hero && heroTitle}
<!-- Hero: split layout with circle image and floating chips -->
<section class="bg-[#F1F4E9]">
  <div class="container-w py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
    <div>
      <h1 class="text-5xl sm:text-6xl font-extrabold leading-tight text-brand-richBlack">{heroTitle}</h1>
      {#if heroSubtitle}
        <p class="mt-4 max-w-xl text-brand-slateGray">{heroSubtitle}</p>
      {/if}
      <div class="mt-8 flex gap-3">
        <a href="/perks" class="inline-flex px-5 py-3 rounded-md bg-yellow-400 hover:bg-yellow-500 font-semibold text-brand-richBlack">Explore All Perks</a>
        <a href="/partner" class="inline-flex px-5 py-3 rounded-md bg-brand-darkGreen text-white hover:brightness-110">List Your Perks</a>
      </div>
    </div>
    {#if heroImage}
      <div class="relative flex justify-center">
        <div class="w-72 h-72 sm:w-96 sm:h-96 rounded-full overflow-hidden ring-8 ring-white/60 shadow-card">
      <img src={heroImage} alt="Hero" class="w-full h-full object-cover" loading="lazy" />
        </div>
        <!-- floating chips -->
        {#each heroChips as chip, i}
          <div class={`hidden sm:block absolute bg-white rounded-xl shadow-card px-3 py-2 text-xs ${i === 0 ? '-top-3 left-6' : i === 1 ? 'top-8 -right-3' : '-bottom-4 left-10'}`}>
            <div class="font-semibold">{chip.title}</div>
            <div class="text-gray-500">{chip.detail}</div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  <div class="sr-only" aria-hidden="true"></div>
</section>
{/if}

{#if howItWorks && howItWorksCards.length > 0}
<!-- How It Works -->
<section class="container-w py-16">
  {#if howItWorks.title}
    <h2 class="text-3xl font-bold text-center text-brand-richBlack">{howItWorks.title}</h2>
  {/if}
  {#if howItWorks.subtitle}
    <p class="mt-2 text-center text-brand-slateGray">{howItWorks.subtitle}</p>
  {/if}
  <div class="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
    {#each howItWorksCards as card}
      <div class="text-center bg-white rounded-xl shadow-card p-6">
        {#if card.icon}
          <div class="mx-auto w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-xl" aria-hidden="true">
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

{#if latestPerksSection && latestPerks.length > 0}
<!-- Latest Perks -->
<section class="container-w py-12">
  <div class="text-center">
    {#if latestPerksTitle}
      <h2 class="text-3xl font-bold text-brand-richBlack">{latestPerksTitle}</h2>
    {/if}
    {#if latestPerksSubtitle}
      <p class="mt-1 text-brand-slateGray">{latestPerksSubtitle}</p>
    {/if}
  </div>
  <div class="text-end">
     <a href="/perks" class="inline-block mt-2 me-2 text-brand-darkGreen hover:underline">See all</a>
  </div>
  <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each latestPerks as p}
      <PerkCard
        title={p.title}
        perkId={p.id}
        partner={p.partner_name}
        location={p.location}
        image={withAsset(p.media?.banner)}
        logo={withAsset(p.partner_logo)}
        description={p.short_description}
        cta={p.redeem_type === 'external_link' ? 'Secure my spot' : 'Claim this perk'}
        redeemType={p.redeem_type}
        externalUrl={p.external_url}
        couponCode={p.coupon_code}
        validUntil={p.valid_until ? p.valid_until.slice(0, 10) : undefined}
      />
    {/each}
  </div>
</section>
{/if}

{#if journalSection && journal.length > 0}
<!-- Journal -->
<section class="container-w py-12">
  <div class="text-center">
    {#if journalTitle}
      <h2 class="text-3xl font-bold text-brand-richBlack">{journalTitle}</h2>
    {/if}
    {#if journalSubtitle}
      <p class="mt-1 text-brand-slateGray">{journalSubtitle}</p>
    {/if}
  </div>
  <div class="text-end">
    <a href="/journal" class="inline-block mt-2 me-2 text-brand-darkGreen hover:underline">See all</a>
  </div>
  <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
    {#each journal as p}
      <article class="bg-white rounded-xl shadow-card overflow-hidden">
        <a href={`/journal/${p.slug}`} class="block">
          <div class="relative aspect-[16/10] bg-gray-100">
            <img src={withAsset(p.og_image) || PERK_PLACEHOLDER} alt={p.title} class="w-full h-full object-cover" loading="lazy" />
            {#if p.category || p.category_data}
              <div class="absolute top-3 left-3 inline-flex px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">
                {p.category || p.category_data?.name}
              </div>
            {/if}
          </div>
          <div class="p-6">
            <h3 class="font-semibold text-brand-richBlack text-lg">{p.title}</h3>
            <div class="mt-1 text-xs text-gray-500">{p.created_at?.slice(0,10)} • {p.reading_time || 5} min read</div>
            {#if p.excerpt}
              <p class="mt-2 text-sm text-brand-slateGray">{p.excerpt}</p>
            {/if}
            <div class="mt-3 text-yellow-700 font-semibold">Read More →</div>
          </div>
        </a>
      </article>
    {/each}
  </div>
</section>
{/if}
