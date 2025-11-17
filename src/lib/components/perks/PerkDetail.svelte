<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
  import ClaimForm from '$lib/components/forms/ClaimForm.svelte';
  import ShareButtons from './ShareButtons.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import { toastStore } from '$lib/stores/toast';
  export let perk: any;
  let openClaim = false;
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      toastStore.push('Coupon code copied!', 'success');
    } catch (e) {
      try {
        const el = document.createElement('textarea');
        el.value = code;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        toastStore.push('Coupon code copied!', 'success');
      } catch {
        toastStore.push('Failed to copy code', 'error');
      }
    }
  }
</script>

<article class="bg-white rounded-xl shadow-card overflow-hidden">
  {#if perk?.media?.banner}
    <img src={perk.media.banner} alt={perk.title} class="w-full h-56 object-cover" />
  {/if}
  <div class="p-6">
    <div class="text-sm text-gray-500">{perk.partner_name} • {perk.location}</div>
    <h1 class="mt-1 text-3xl font-bold text-brand-richBlack">{perk.title}</h1>
    {#if perk.short_description}
      <p class="mt-2 text-brand-slateGray">{perk.short_description}</p>
    {/if}

    <div class="mt-6 prose max-w-none" >
      {@html perk.description}
    </div>

    <div class="mt-6 bg-brand-offWhite rounded-xl p-4">
      <div class="font-semibold text-brand-richBlack">Redeem</div>
      {#if perk.redeem_type === 'coupon_code' && perk.coupon_code}
        <div class="mt-2 flex items-center gap-3">
          <div class="px-3 py-2 bg-white border rounded">{perk.coupon_code}</div>
          <Button variant="secondary" on:click={() => copyCode(perk.coupon_code)}>Copy Code</Button>
        </div>
      {:else if perk.redeem_type === 'external_link' && perk.partner_url}
        <div class="mt-2">
          <Button href={perk.partner_url} variant="primary">Go to Partner</Button>
        </div>
      {:else}
        <div class="mt-2 text-sm text-brand-slateGray">Fill in the claim form to proceed.</div>
        <div class="mt-3">
          <Button on:click={() => (openClaim = true)} variant="secondary">Open Claim Form</Button>
        </div>
      {/if}
    </div>
  </div>
  <div class="px-6 pb-6">
    <div class="mt-6">
      <div class="text-sm text-brand-slateGray mb-2">Share</div>
      <ShareButtons url={pageUrl} title={perk?.title} variant="single" label="Share Perk" />
    </div>
  </div>
</article>

<Modal bind:open={openClaim} title="Claim Perk" on:close={() => (openClaim = false)}>
  <ClaimForm perkId={perk.id} />
</Modal>
