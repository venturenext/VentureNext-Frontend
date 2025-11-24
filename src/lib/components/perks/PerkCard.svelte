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

<article class="bg-white rounded-2xl shadow-card overflow-hidden ring-1 ring-gray-100 hover:shadow-lg transition" data-location={location}>
  <div class="block focus:outline-none">
    <div class="relative aspect-[16/9] bg-gray-100">
      <img
        src={bannerImage}
        alt={title}
        class="w-full h-full object-cover"
        loading="lazy"
        on:error={handleImageError}
      />
      <div class="absolute top-2 left-2 flex items-center gap-2">
        {#if logo}
          <div class="w-9 h-9 rounded-full bg-white ring-2 ring-white overflow-hidden flex items-center justify-center">
            <img src={withAsset(logo)} alt={`${partner} logo`} class="w-8 h-8 object-cover rounded-full" loading="lazy" />
          </div>
        {:else}
          <div class="w-9 h-9 rounded-full bg-white/90 ring-2 ring-white flex items-center justify-center text-sm font-semibold text-brand-richBlack">
            {partnerInitial(partner)}
          </div>
        {/if}
        <span class="px-2 py-1 rounded-full bg-black/40 text-white text-xs backdrop-blur-sm">
          {partner}
        </span>
      </div>
      {#if validUntil}
        <div class="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/50 text-white text-xs backdrop-blur-sm">
          Valid until {validUntil}
        </div>
      {/if}
    </div>
    <div class="p-5 space-y-2">
      <h3 class="text-lg font-semibold text-brand-richBlack">{title}</h3>
      {#if description}
        <p class="text-sm text-brand-slateGray">{description}</p>
      {/if}
    </div>
  </div>
  <div class="px-5 pb-5">
    <button
      type="button"
      class="block w-full rounded-lg bg-yellow-400 hover:bg-yellow-500 text-brand-richBlack font-semibold py-2 transition text-center"
      aria-label={cta}
      on:click={handleCta}
    >
      {cta}
    </button>
  </div>
</article>

{#if perkId}
  <Modal bind:open={openClaim} title="Claim Perk" on:close={() => (openClaim = false)}>
    <div class="space-y-3 text-sm text-gray-700 mb-4">
      <div class="flex items-center justify-between">
        <span class="font-semibold">Perk</span>
        <span class="text-gray-600">{title}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="font-semibold">Company</span>
        <span class="text-gray-600">{partner}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="font-semibold">Location</span>
        <span class="text-gray-600 uppercase">{location}</span>
      </div>
      {#if validUntil}
        <div class="flex items-center justify-between">
          <span class="font-semibold">Valid until</span>
          <span class="text-gray-600">{validUntil}</span>
        </div>
      {/if}
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
