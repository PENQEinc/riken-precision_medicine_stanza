<script lang="ts">
  import Fa from "svelte-fa";
  import TextWithIcon from "../../lib/TextWithIcon.svelte";
  import { calculationType } from "./data";
  import type { DatumConverted } from "./types/types";
  import { selectedCalcName, selectedCompoundId } from "./utils/fetchStore";
  import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
  import Popup from "../../lib/popup/Popup.svelte";
  export let dataRow: DatumConverted;

  const calculationTypes = Object.keys(dataRow.calculation);

  let refs = [] as HTMLElement[];

  $: url = makeUrl($selectedCalcName, $selectedCompoundId);

  function makeUrl(calcName: string, compoundId: string) {
    if (
      !dataRow.assembly ||
      !dataRow.genename ||
      !dataRow.variant ||
      !compoundId ||
      !dataRow.calculation[calcName]
    )
      return undefined;
    try {
      return `${window.location.origin}/calculation/details?assembly=${
        dataRow.assembly
      }&genename=${
        dataRow.genename
      }&calculation_type=${calcName}&Compound_ID=${compoundId}&PDB_ID=${
        compoundId ? dataRow.calculation[calcName][compoundId].PDB_ID : null
      }&variant=${dataRow.variant}`;
    } catch (error) {
      return undefined;
    }
  }
</script>

<td>
  {#if $selectedCalcName === "Variants"}
    <ul>
      {#each calculationTypes as calcName, index}
        <li bind:this={refs[index]}>
          <Popup popperParams={{ placement: "top" }}>
            <ul class="compound-list" slot="tooltip">
              {#each Object.keys(dataRow.calculation[calcName]) as compound}
                <li>
                  <a
                    href={makeUrl(calcName, compound)}
                    class="link-calc compound"
                  >
                    {compound}
                  </a>
                </li>
              {/each}
            </ul>
            <TextWithIcon
              text={calcName}
              iconAlt={calcName}
              slot="trigger"
              icon={calculationType(calcName).src}
            >
              <Fa
                icon={faCircleChevronRight}
                size="90%"
                color="var(--calc-color)"
              />
            </TextWithIcon>
          </Popup>
        </li>
      {/each}
    </ul>
  {:else}
    <span class="calculation-container">
      <TextWithIcon
        text={$selectedCalcName}
        iconAlt={$selectedCalcName}
        {url}
        icon={calculationType($selectedCalcName).src}
      />
      <Fa icon={faCircleChevronRight} size="90%" color="var(--calc-color)" />
    </span>
  {/if}
</td>

<style lang="scss" scoped>
  .compound {
    font-weight: 400;
    text-transform: capitalize;
  }
</style>
