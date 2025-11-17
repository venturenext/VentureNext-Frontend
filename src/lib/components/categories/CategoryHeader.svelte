<script lang="ts">
  export let name: string;
  export let description: string = '';
  export let icon: string | null = null;
</script>

<div class="bg-white rounded-xl shadow-card p-6">
  <div class="flex items-start gap-4">
    {#if icon}
      <div class="text-4xl">{icon}</div>
    {/if}
    <div>
      <h1 class="text-3xl font-bold text-brand-richBlack">{name}</h1>
      {#if description}
        <p class="mt-2 text-brand-slateGray">{description}</p>
      {/if}
    </div>
  </div>
</div>

