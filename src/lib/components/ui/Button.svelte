<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  export let href: string | null = null;
  export let type: 'button' | 'submit' = 'button';
  export let disabled: boolean = false;
  const base = 'inline-flex items-center justify-center px-4 py-2 rounded-full font-semibold transition';
  const styles = {
    primary: 'bg-brand-yellow text-brand-richBlack hover:opacity-90',
    secondary: 'bg-brand-darkGreen text-white hover:brightness-110',
    ghost: 'bg-transparent text-brand-darkGreen hover:bg-brand-darkGreen/10'
  } as const;
</script>

{#if href}
  <a {...$$restProps} class="{base} {styles[variant]}" href={href} on:click><slot /></a>
{:else}
  <button {...$$restProps} class="{base} {styles[variant]}" type={type} {disabled} on:click><slot /></button>
{/if}
