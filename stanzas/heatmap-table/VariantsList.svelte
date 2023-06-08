<script lang="ts">
  export let loading: boolean;
  import TextWithIcon from "./TextWithIcon.svelte";
  import { calculationType } from "./data";
  import {
    calculationsCount,
    selectedCalcName,
    selectedCompoundId,
  } from "./utils/fetchStore";

  let selectedCalcNameIndex: number | undefined = undefined;
  let selectedCompoundIndex: number | undefined = undefined;

  $: calcNames = Object.keys($calculationsCount);

  let currentCompoundList = [];

  function handleliClick(index: number) {
    index = infiniteKeyList(index, calcNames.length);
    selectedCalcNameIndex = index;

    $selectedCalcName = calcNames[selectedCalcNameIndex];

    if ($calculationsCount[$selectedCalcName]?.compounds) {
      $selectedCompoundId = [
        ...$calculationsCount[$selectedCalcName]?.compounds.values(),
      ][0];

      currentCompoundList = [
        ...$calculationsCount[$selectedCalcName]?.compounds.values(),
      ];
    } else {
      currentCompoundList = [];
      $selectedCompoundId = null;
    }
  }

  function infiniteKeyList(indexToChange: number, listLength: number) {
    let i = indexToChange % listLength;
    if (i < 0) i = listLength + i;
    return i;
  }

  function makeKeyDownScrollFunction(
    indexToChange: number,
    cb: (index: number) => void
  ) {
    return function (e: KeyboardEvent) {
      e.preventDefault();
      if (typeof indexToChange === "undefined") {
        indexToChange = 0;
      }
      switch (e.key) {
        case "ArrowDown":
          {
            indexToChange++;
          }

          break;
        case "ArrowUp":
          {
            indexToChange--;
          }
          break;

        default:
          break;
      }
      cb(indexToChange);
    };
  }

  const calcListKeyDown = makeKeyDownScrollFunction(
    selectedCalcNameIndex,
    handleliClick
  );
  const compoundListKeyDown = makeKeyDownScrollFunction(
    selectedCompoundIndex,
    compoundHandleClick
  );

  function compoundHandleClick(index: number) {
    $selectedCompoundId =
      currentCompoundList[infiniteKeyList(index, currentCompoundList.length)];
  }
</script>

<div class="column-list">
  <ul class="column-ul" on:keydown={calcListKeyDown} tabindex="-1">
    {#if loading}
      <p>Loading...</p>
    {:else}
      {#each calcNames as calcName, index}
        <li
          tabindex="-1"
          on:click={() => handleliClick(index)}
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
    <ul class="drugs-ul" on:keydown={compoundListKeyDown} tabindex="-1">
      {#each currentCompoundList as drugName, index}
        <li
          class:selected={drugName === $selectedCompoundId}
          data-compound={drugName}
          on:click={() => compoundHandleClick(index)}
          on:keydown={() => {}}
        >
          {drugName}
        </li>
      {/each}
    </ul>
  </div>
{/if}
