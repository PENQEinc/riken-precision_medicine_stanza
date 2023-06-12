<script lang="ts">
  import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
  import { scoreTheads } from "./data";
  import {
    dataset,
    selectedCalcName,
    selectedCompoundId,
    heatmapData,
  } from "./utils/fetchStore";
  import Fa from "svelte-fa";
  import TableRowHeatmap from "./TableRowHeatmap.svelte";
  import TableRowCalculation from "./TableRowCalculation.svelte";

  export let loading: boolean;

  let selectedRowIndex: number | undefined = undefined;

  $: if (typeof selectedRowIndex !== "undefined") {
    dispatchEvent(
      new CustomEvent("updateMolstar", {
        detail: $dataset[selectedRowIndex].PDBlist_single_wild,
        composed: true,
        bubbles: true,
      })
    );
  }
</script>

<div class="table-container">
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th class="th-gene" rowspan="2"> UniProt Accession</th>
          <th class="th-variant" rowspan="2">Variant</th>
          <th class="th-variant" rowspan="2">GenBank</th>
          <th class="th-disease th-group" colspan="2">Significance</th>
          {#if $selectedCalcName !== "Variants"}
            <th class="th-calc th-group" colspan="1"
              ><p>Single Calculation</p></th
            >
            <th class="th-calc th-group" colspan="2"
              ><p>Multiple Calculation</p></th
            >
          {/if}
          <th class="th-calc" rowspan="2">Calculation</th>
          {#each scoreTheads as { className, label }}
            <th class={className} rowspan="2"><p>{label}</p></th>
          {/each}
        </tr>
        <tr>
          <th class="th-disease" rowspan="1">MGeND</th>
          <th class="th-disease" rowspan="1">ClinVar</th>
          {#if $selectedCalcName !== "Variants"}
            <th class="th-calc" rowspan="1" data-calc="mutation"
              ><p>ΔΔG (kcal/mol)</p></th
            >
            <th class="th-calc" rowspan="1" data-calc="mutation"
              ><p>Average ΔΔG (kcal/mol)</p></th
            >
            <th class="th-calc" rowspan="1" data-calc="mutation"
              ><p>Standard Deviation</p></th
            >
          {/if}
        </tr>
      </thead>
      <tbody>
        {#if loading}
          <div class="loading">
            <p>Loading...</p>
          </div>
        {:else if $dataset.length === 0}
          <div class="loading">
            <p>No data found</p>
          </div>
        {:else}
          {#each $dataset as dataRow, index}
            <tr
              on:click={() => {
                if (selectedRowIndex === index) {
                  selectedRowIndex = undefined;
                } else {
                  selectedRowIndex = index;
                }
              }}
            >
              <td class="td-uniprot">
                <input
                  class="radio-button"
                  type="radio"
                  name="variantid"
                  value={dataRow.uniprot_acc}
                  checked={selectedRowIndex === index}
                />
                {dataRow.uniprot_acc}
              </td>

              <td>
                <a
                  class="link-variant"
                  href={`${window.location.origin}/dev/variants/details?assembly=${dataRow.assembly}&chr=${dataRow.chr}&start=${dataRow.start}&end=${dataRow.end}&ref=${dataRow.ref}&alt=${dataRow.alt}&variant=${dataRow.variant}`}
                >
                  {dataRow.variant}<Fa
                    icon={faCircleChevronRight}
                    size="90%"
                    color="var(--variant-color)"
                  /></a
                >
              </td>
              <td>{dataRow.GenBank[0] === undefined ? "" : dataRow.GenBank}</td>
              <td
                >{dataRow.MGeND_ClinicalSignificance[0] === undefined
                  ? ""
                  : dataRow.MGeND_ClinicalSignificance}</td
              >
              <td
                >{dataRow.ClinVar_ClinicalSignificance[0] === undefined
                  ? ""
                  : dataRow.ClinVar_ClinicalSignificance}</td
              >
              {#if $selectedCalcName && $selectedCalcName !== "Variants"}
                {#if !!dataRow.calculation[$selectedCalcName] && !!dataRow.calculation[$selectedCalcName][$selectedCompoundId]}
                  {@const isEmpty =
                    dataRow.calculation[$selectedCalcName][$selectedCompoundId]
                      .FE_Bind_mean === null &&
                    dataRow.calculation[$selectedCalcName][$selectedCompoundId]
                      .FE_Bind_std === null}
                  {@const isSingle =
                    dataRow.calculation[$selectedCalcName][$selectedCompoundId]
                      .FE_Bind_mean !== null &&
                    dataRow.calculation[$selectedCalcName][$selectedCompoundId]
                      .FE_Bind_std === null}
                  {@const isMultiple =
                    dataRow.calculation[$selectedCalcName][$selectedCompoundId]
                      .FE_Bind_mean !== null &&
                    dataRow.calculation[$selectedCalcName][$selectedCompoundId]
                      .FE_Bind_std !== null}
                  {#if isEmpty}
                    <td />
                    <td />
                    <td />
                  {:else if isSingle}
                    <td
                      >{dataRow.calculation[$selectedCalcName][
                        $selectedCompoundId
                      ].FE_Bind_mean}</td
                    >
                    <td />
                    <td />
                  {:else if isMultiple}
                    <td />
                    <td
                      >{dataRow.calculation[$selectedCalcName][
                        $selectedCompoundId
                      ]?.FE_Bind_mean}</td
                    >
                    <td
                      >{dataRow.calculation[$selectedCalcName][
                        $selectedCompoundId
                      ]?.FE_Bind_std}</td
                    >
                  {/if}
                {:else}
                  <td />
                  <td />
                  <td />
                {/if}
              {/if}
              <TableRowCalculation {dataRow} />
              <TableRowHeatmap heatmapRow={$heatmapData[index]} />
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
  <div class="legend">
    <p>Benign</p>
    <div class="legend-bar" />
    <p>Pathogenic</p>
  </div>
</div>
