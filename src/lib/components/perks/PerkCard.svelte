<script lang="ts">
  import Modal from '$lib/components/ui/Modal.svelte';
  import ClaimForm from '$lib/components/forms/ClaimForm.svelte';
  import { PERK_PLACEHOLDER } from '$lib/config';
  import { withAsset } from '$lib/utils/assets';
  import { trackImpression, trackClick, trackAffiliateClick } from '$lib/utils/analytics';
  import { onMount } from 'svelte';
  import type { RedeemType } from '$lib/types/perk';

  export let title = 'Sample Perk';
  export let partner = 'Partner';
  export let location = 'global';
  export let image = '';
  export let logo: string | undefined = undefined;
  export let description: string = '';
  export let cta: string = 'Claim this perk';
  export let validUntil: string | undefined = undefined;
  export let perkId: number | undefined = undefined;
  export let redeemType: RedeemType | undefined = undefined;
  export let externalUrl: string | undefined = undefined;
  export let couponCode: string | undefined = undefined;

  // Track impression when card is mounted
  onMount(() => {
    if (perkId) {
      trackImpression(perkId);
    }
  });

  function partnerInitial(name: string) {
    const n = (name || '').trim();
    return n ? n.charAt(0).toUpperCase() : '?';
  }

  // Fallback image jika tidak ada atau kosong
  $: bannerImage = (image && typeof image === 'string' && image.trim().length > 0) ? withAsset(image) : PERK_PLACEHOLDER;

  // Handle error loading image
  function handleImageError(e: Event) {
    const img = e.target as HTMLImageElement;
    if (img.src !== PERK_PLACEHOLDER) {
      img.src = PERK_PLACEHOLDER;
    }
  }

  let openClaim = false;
  let copied = false;

  function handleCta() {
    // Track click when user clicks CTA button
    if (perkId) {
      trackClick(perkId);
    }
    openClaim = true;
  }

  function handleClaimAction() {
    if ((redeemType === 'external_link' || redeemType === 'lead_form') && externalUrl) {
      // Track affiliate click when opening external link
      if (perkId) {
        trackAffiliateClick(perkId);
      }
      window.open(externalUrl, '_blank', 'noopener');
      openClaim = false;
    }
  }

  async function handleCopy() {
    if (!couponCode) return;
    try {
      await navigator.clipboard.writeText(couponCode);
      copied = true;
      setTimeout(() => (copied = false), 1500);
    } catch (e) {
      copied = false;
    }
  }
</script>

<article
  class="group relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-b from-white to-brand-offWhite shadow-card transition hover:-translate-y-1 hover:shadow-xl"
  data-location={location}
>
  <div class="block focus:outline-none">
    <div class="relative aspect-[16/9] bg-gray-100 overflow-hidden">
      <img
        src={bannerImage}
        alt={title}
        class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
        loading="lazy"
        on:error={handleImageError}
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/30"></div>
      <div class="absolute top-3 left-3 flex items-center gap-2">
        {#if logo}
          <div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white ring-2 ring-white/80 shadow-md">
            <img src={withAsset(logo)} alt={`${partner} logo`} class="h-9 w-9 rounded-full object-cover" loading="lazy" />
          </div>
        {:else}
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 ring-2 ring-white/80 text-sm font-semibold text-brand-richBlack shadow-md">
            {partnerInitial(partner)}
          </div>
        {/if}
        <span class="rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm ring-1 ring-white/40">
          {partner}
        </span>
      </div>
      <div class="absolute bottom-3 right-3 text-xs text-white/90">
        <div class="rounded-lg bg-black/35 px-3 py-1 backdrop-blur-sm ring-1 ring-white/25">
          {location.toUpperCase()}{#if validUntil} · Valid until {validUntil}{/if}
        </div>
      </div>
    </div>
    <div class="space-y-3 px-5 py-4">
      <h3 class="text-lg font-semibold leading-snug text-brand-richBlack">{title}</h3>
      {#if description}
        <p class="text-sm leading-relaxed text-brand-slateGray">{description}</p>
      {/if}
    </div>
  </div>
  <div class="px-5 pb-5">
    <button
      type="button"
      class="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-darkGreen to-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 transition hover:translate-y-px hover:shadow-xl"
      aria-label={cta}
      on:click={handleCta}
    >
      {cta}
      <span aria-hidden="true">→</span>
    </button>
  </div>
</article>

{#if perkId}
  <Modal bind:open={openClaim} title="Claim Perk" on:close={() => (openClaim = false)}>
    <div class="mb-5 rounded-2xl border border-gray-100 bg-gradient-to-r from-brand-offWhite to-white p-4 shadow-inner">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.12em] text-gray-500">Perk</p>
          <p class="text-base font-semibold text-brand-richBlack">{title}</p>
        </div>
        <span class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase text-brand-darkGreen ring-1 ring-brand-darkGreen/15">
          {location}
        </span>
      </div>

      <div class="mt-4 grid grid-cols-1 gap-3 text-sm text-brand-slateGray md:grid-cols-2">
        <div class="rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-gray-100">
          <p class="text-xs uppercase tracking-[0.08em] text-gray-500">Company</p>
          <p class="font-semibold text-brand-richBlack">{partner}</p>
        </div>
        {#if validUntil}
          <div class="rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-gray-100">
            <p class="text-xs uppercase tracking-[0.08em] text-gray-500">Valid until</p>
            <p class="font-semibold text-brand-richBlack">{validUntil}</p>
          </div>
        {/if}
      </div>

    </div>

    {#if redeemType === 'external_link' && externalUrl}
      <div class="space-y-2">
        <button
          type="button"
          class="w-full rounded-lg bg-brand-darkGreen text-white font-semibold py-2 hover:brightness-110"
          on:click={handleClaimAction}
        >
          Open Link
        </button>
        <p class="text-xs text-gray-500">
          You will be redirected to the partner to redeem.
        </p>
      </div>
    {:else if redeemType === 'lead_form' && externalUrl}
      <div class="space-y-2">
        <button
          type="button"
          class="w-full rounded-lg bg-brand-darkGreen text-white font-semibold py-2 hover:brightness-110"
          on:click={handleClaimAction}
        >
          Claim My Spot
        </button>
        <p class="text-xs text-gray-500">
          You will be redirected to the claim form to redeem.
        </p>
      </div>
    {:else if redeemType === 'coupon_code'}
      {#if couponCode}
        <div class="space-y-2">
          <div class="text-sm font-semibold text-brand-richBlack">Redeem</div>
          <div class="flex items-center gap-3">
            <div class="px-3 py-2 bg-white rounded border text-sm font-mono shadow-sm">{couponCode}</div>
            <button
              type="button"
              class="px-3 py-2 rounded-full bg-brand-darkGreen text-white text-sm hover:brightness-110"
              on:click={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        </div>
      {:else}
        <p class="text-sm text-gray-600">Coupon code will be provided by the partner.</p>
      {/if}
    {:else}
      <ClaimForm perkId={perkId} on:success={() => (openClaim = false)} />
    {/if}
  </Modal>
{/if}
