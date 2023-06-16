<script lang="ts">
  export let loading: boolean;
  import TextWithIcon from "../../lib/TextWithIcon.svelte";
  import { calculationType } from "./data";
  import {
    calculationsCount,
    selectedCalcName,
    selectedCompoundId,
  } from "./utils/fetchStore";

  let selectedCalcNameIndex = 0;
  let selectedCompoundIndex: number | undefined = undefined;

  $: calcNames = Object.keys($calculationsCount);

  $: if ($selectedCalcName) {
    dispatchEvent(
      new CustomEvent("updateBarChart", {
        detail: [$selectedCalcName, $selectedCompoundId],
        composed: true,
        bubbles: true,
      })
    );
  }

  let currentCompoundList = [];

  function handleCalcClick(index: number) {
    index = infiniteKeyList(index, calcNames.length);
    selectedCalcNameIndex = index;

    $selectedCalcName = calcNames[selectedCalcNameIndex];

    if ($calculationsCount[$selectedCalcName]?.compounds) {
      $selectedCompoundId = [
        ...Object.keys($calculationsCount[$selectedCalcName]?.compounds),
      ][0];

      currentCompoundList = [
        ...Object.keys($calculationsCount[$selectedCalcName]?.compounds),
      ];
    } else {
      currentCompoundList = [];
      $selectedCompoundId = null;
    }
  }

  function handleCompoundClick(index: number) {
    selectedCompoundIndex = index;
    $selectedCompoundId = currentCompoundList[index];
  }

  function infiniteKeyList(indexToChange: number, listLength: number) {
    let i = indexToChange % listLength;
    if (i < 0) i = listLength + i;
    return i;
  }

  function handleCompoundKeyDown(e: KeyboardEvent) {
    e.preventDefault();
    switch (e.key) {
      case "ArrowDown":
        {
          if (typeof selectedCompoundIndex === "undefined") {
            selectedCompoundIndex = 0;
          } else {
            selectedCompoundIndex = infiniteKeyList(
              selectedCompoundIndex + 1,
              currentCompoundList.length
            );
          }
          handleCompoundClick(selectedCompoundIndex);
        }

        break;
      case "ArrowUp":
        {
          if (typeof selectedCompoundIndex === "undefined") {
            selectedCompoundIndex = 0;
          } else {
            selectedCompoundIndex = infiniteKeyList(
              selectedCompoundIndex - 1,
              currentCompoundList.length
            );
          }
          handleCompoundClick(selectedCompoundIndex);
        }
        break;

      default:
        break;
    }
  }

  function handleCalcKeyDown(e: KeyboardEvent) {
    e.preventDefault();
    switch (e.key) {
      case "ArrowDown":
        {
          if (typeof selectedCalcNameIndex === "undefined") {
            selectedCalcNameIndex = 0;
          } else {
            selectedCalcNameIndex = infiniteKeyList(
              selectedCalcNameIndex + 1,
              calcNames.length
            );
          }
          handleCalcClick(selectedCalcNameIndex);
        }

        break;
      case "ArrowUp":
        {
          if (typeof selectedCalcNameIndex === "undefined") {
            selectedCalcNameIndex = 0;
          } else {
            selectedCalcNameIndex = infiniteKeyList(
              selectedCalcNameIndex - 1,
              calcNames.length
            );
          }
          handleCalcClick(selectedCalcNameIndex);
        }
        break;

      default:
        break;
    }
  }
</script>

<div class="column-list">
  <ul class="column-ul" on:keydown={handleCalcKeyDown} tabindex="-1">
    {#if loading}
      <p>Loading...</p>
    {:else}
      {#each calcNames as calcName, index}
        <li
          tabindex="-1"
          on:click={() => handleCalcClick(index)}
          on:keydown={() => {}}
          class:selected={index === selectedCalcNameIndex}
        >
          <TextWithIcon
            text={calcName}
            icon={calculationType(calcName).src}
            iconAlt={calcName}
          />
          <span class="num">{$calculationsCount[calcName].size}</span>
        </li>
      {/each}
    {/if}
  </ul>
</div>
{#if currentCompoundList.length > 0}
  <div class="drugs-list">
    <ul class="drugs-ul" on:keydown={handleCompoundKeyDown} tabindex="-1">
      {#each currentCompoundList as drugName, index}
        <li
          class:selected={drugName === $selectedCompoundId}
          data-compound={drugName}
          on:click={() => handleCompoundClick(index)}
          on:keydown={() => {}}
        >
          {drugName}
          <span class="num"
            >{$calculationsCount[$selectedCalcName].compounds[drugName]}</span
          >
        </li>
      {/each}
    </ul>
  </div>
{/if}
