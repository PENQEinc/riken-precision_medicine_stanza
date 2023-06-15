<script lang="ts">
  export let text: string,
    url: string | undefined = undefined,
    icon: string | undefined = undefined,
    iconAlt: string | undefined = undefined;
</script>

{#if url}
  <a class="link-calc" href={url}>
    {#if icon}
      <img class="icon" src={icon} alt={iconAlt ?? ""} />
    {/if}
    <span>{text}</span></a
  >
{:else}
  {#if icon}
    <img class="icon" src={icon} alt={iconAlt ?? ""} />
  {/if}
  <span>{text}</span>
{/if}
