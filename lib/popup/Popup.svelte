<script lang="ts">
  import { createPopper } from "@popperjs/core";
  import { type Placement } from "@popperjs/core";
  import { onDestroy } from "svelte";

  export let trigger: HTMLElement;
  export let placement: Placement;
  export let show: boolean = false;

  let content: HTMLElement;
  let popper: any;
  let tooltipHover: boolean = false;

  function toggleOn() {
    show = true;
  }
  function toggleOff() {
    if (!tooltipHover) {
      show = false;
    }
  }
  function addEventListeners() {
    trigger.addEventListener("mouseenter", toggleOn);
    trigger.addEventListener("mouseover", toggleOn);
    trigger.addEventListener("mouseleave", toggleOff);
  }

  $: if (trigger) {
    addEventListeners();
  }

  function handleTooltipMouseEnter(e: MouseEvent) {
    tooltipHover = true;
    console.log("handleTooltipMouseEnter");
  }

  function handleTooltipMouseLeave(e: MouseEvent) {
    show = false;
    tooltipHover = false;
  }

  $: if (trigger && content) {
    popper = createPopper(trigger, content, {
      placement,
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 8],
          },
        },
      ],
    });
  } else {
    popper?.destroy();
  }

  onDestroy(() => {
    popper?.destroy();
    trigger?.removeEventListener("mouseenter", toggleOn);
    trigger?.removeEventListener("mouseover", toggleOn);
    trigger?.removeEventListener("mouseleave", toggleOff);
  });

  $: if (popper) {
    popper?.update({ show });
  }
</script>

{#if show}
  <div
    id="tooltip"
    bind:this={content}
    class="tooltip"
    role="tooltip"
    on:mouseenter={handleTooltipMouseEnter}
    on:mouseleave={handleTooltipMouseLeave}
  >
    <slot />
    <div id="arrow" data-popper-arrow />
    <div class="backdrop" on:mouseenter={handleTooltipMouseEnter} />
  </div>
{/if}

<style lang="scss" scoped>
  .backdrop {
    position: absolute;
    width: 100%;
    height: 12px;
    left: 0;
  }
  .tooltip {
    background: #333;
    color: white;
    font-weight: bold;
    padding: 4px 8px;
    font-size: 13px;
    border-radius: 4px;
  }

  [data-popper-placement^="top"] {
    > #arrow {
      bottom: -10px;
    }
  }

  [data-popper-placement^="bottom"] {
    > #arrow {
      top: -10px;
    }
    /* > .backdrop {
      top: -11px;
    } */
  }
  [data-popper-placement^="left"] {
    > #arrow {
      right: -10px;
    }
    /* > .backdrop {
      right: -11px;
    } */
  }

  [data-popper-placement^="right"] {
    > #arrow {
      left: -10px;
    }
    /* > .backdrop {
      left: -11px;
    } */
  }

  #arrow,
  #arrow::before {
    position: absolute;
    width: 8px;
    height: 8px;
    background: inherit;
    z-index: 1000;
  }

  #arrow {
    visibility: hidden;
  }

  #arrow::before {
    visibility: visible;
    content: "";
    transform: rotate(45deg);
  }
</style>
