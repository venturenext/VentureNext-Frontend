<script lang="ts">
  import PerkCard from './PerkCard.svelte';
  import type { PerkListItem } from '$lib/types/perk';
  import { withAsset } from '$lib/utils/assets';
  export let items: PerkListItem[] = [];
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {#each items as p}
    <PerkCard
      title={p.title}
      perkId={p.id}
      partner={p.partner_name}
      location={p.location}
      image={withAsset(p.media?.banner)}
      logo={withAsset(p.partner_logo)}
      description={p.short_description}
      cta={p.redeem_type === 'external_link' ? 'Secure my spot' : 'Claim this perk'}
      validUntil={p.valid_until ? p.valid_until.slice(0, 10) : undefined}
      redeemType={p.redeem_type}
      externalUrl={p.external_url}
      couponCode={p.coupon_code}
    />
  {/each}
</div>
