<script lang="ts">
  export let schema: Record<string, any> | Array<Record<string, any>> | null = null;
  $: json = schema ? JSON.stringify(schema) : null;
</script>

<svelte:head>
  {#if json}
    <script type="application/ld+json">{json}</script>
  {/if}
  
</svelte:head>
