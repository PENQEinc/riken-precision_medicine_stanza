<script lang="ts">
  import Fa from "svelte-fa";
  import TextWithIcon from "./TextWithIcon.svelte";
  import { calculationType } from "./data";
  import type { DatumConverted } from "./types/types";
  import { selectedCalcName, selectedCompoundId } from "./utils/fetchStore";
  import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
  export let dataRow: DatumConverted;

  const calculationTypes = Object.keys(dataRow.calculation);

  function makeUrl(calcName: string) {
    if (!dataRow.calculation[calcName]) return undefined;
    return `${window.location.origin}/dev/calculation/details?assembly=${
      dataRow.assembly
    }&genename=${
      dataRow.genename
    }&calculation_type=${calcName}&Compound_ID=${$selectedCompoundId}&PDB_ID=${
      $selectedCompoundId
        ? dataRow.calculation[calcName][$selectedCompoundId].PDB_ID
        : null
    }&variant=${dataRow.variant}`;
  }
</script>

<td>
  {#if $selectedCalcName === "Variants"}
    <ul>
      {#each calculationTypes as calcName}
        <li>
          <TextWithIcon
            text={calcName}
            iconAlt={calcName}
            icon={calculationType(calcName).src}
          />
        </li>
      {/each}
    </ul>
  {:else}
    <span class="calculation-container">
      <TextWithIcon
        text={$selectedCalcName}
        iconAlt={$selectedCalcName}
        url={makeUrl($selectedCalcName)}
        icon={calculationType($selectedCalcName).src}
      />
      <Fa icon={faCircleChevronRight} size="90%" color="var(--calc-color)" />
    </span>
  {/if}
</td>
