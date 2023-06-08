<script lang="ts">
  import TextWithIcon from "./TextWithIcon.svelte";
  import { calculationType } from "./data";
  import type { DatumConverted } from "./types/types";
  import { selectedCalcName, selectedCompoundId } from "./utils/fetchStore";
  export let dataRow: DatumConverted;

  const calculationTypes = Object.keys(dataRow.calculation);

  function makeUrl(calcName: string) {
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
            url={makeUrl(calcName)}
            icon={calculationType(calcName).src}
          />
        </li>
      {/each}
    </ul>
  {:else}
    <TextWithIcon
      text={$selectedCalcName}
      iconAlt={$selectedCalcName}
      url={makeUrl($selectedCalcName)}
      icon={calculationType($selectedCalcName).src}
    />
  {/if}
</td>
