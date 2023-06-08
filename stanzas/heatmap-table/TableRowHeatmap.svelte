<script lang="ts">
  import getColor from "@/lib/ColorScale";
  import type { HeatmapDataRow } from "./types/types";

  export let heatmapRow: HeatmapDataRow;
</script>

{#each heatmapRow as datum}
  <td class="cell-td"
    ><div class="cell" style="background-color:{getColor(datum.value)}" /></td
  >
{/each}
