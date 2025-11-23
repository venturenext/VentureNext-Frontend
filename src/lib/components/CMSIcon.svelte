<script lang="ts">
  import {
    Search,
    Gift,
    Eye,
    Rocket,
    Star,
    Check,
    Mail,
    Shield,
    BarChart3,
    CalendarDays,
    Landmark,
    MessageSquare
  } from 'lucide-svelte';

  export let name: string | undefined;
  export let size = '24';
  export let className = 'text-current';

  const map: Record<string, any> = {
    search: Search,
    eyes: Eye,
    eye: Eye,
    gift: Gift,
    rocket: Rocket,
    star: Star,
    check: Check,
    mail: Mail,
    email: Mail,
    shield: Shield,
    chart: BarChart3,
    analytics: BarChart3,
    calendar: CalendarDays,
    bank: Landmark,
    banknote: Landmark,
    building: Landmark,
    chat: MessageSquare,
    message: MessageSquare
  };

  $: Comp = map[(name || '').trim().toLowerCase()];
</script>

{#if Comp}
  <svelte:component this={Comp} size={size} class={className} aria-hidden="true" />
{:else if name}
  <span class={className} aria-hidden="true">{name}</span>
{/if}
