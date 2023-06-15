<script lang="ts">
  import createPopperAction from "./usePopper";
  import { type Options } from "@popperjs/core";

  const [trigger, tooltip, backdrop, show] = createPopperAction();

  export let popperParams: Partial<Options> = { placement: "top" };
</script>

<div use:trigger>
  <slot name="trigger" />
  {#if $show}
    <div use:tooltip={popperParams} class="tooltip">
      <slot name="tooltip" />
      <div id="arrow" data-popper-arrow />
      <div class="backdrop" use:backdrop />
    </div>
  {/if}
</div>
