<script lang="ts">
  import PerkCard from './PerkCard.svelte';
  import type { PerkListItem } from '$lib/types/perk';
  export let items: PerkListItem[] = [];
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {#each items as p}
    <PerkCard
      title={p.title}
      partner={p.partner_name}
      location={p.location}
      href={`/perks/${p.slug}`}
      image={p.media?.banner}
      logo={p.partner_logo}
      description={p.short_description}
      cta={p.redeem_type === 'external_link' ? 'Secure my spot' : 'Claim this perk'}
    />
  {/each}
</div>
