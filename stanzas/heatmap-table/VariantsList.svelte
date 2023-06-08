<script lang="ts">
  export let loading: boolean;
  import {
    calculationsCount,
    selectedCalcName,
    selectedCompoundId,
  } from "./utils/fetchStore";

  $: calcNames = Object.keys($calculationsCount);

  let currentCompoundList = [];

  function handleliClick(calcName: string) {
    $selectedCalcName = calcName;

    if ($calculationsCount[calcName]?.compounds) {
      $selectedCompoundId = [
        ...$calculationsCount[calcName]?.compounds.values(),
      ][0];

      currentCompoundList = [
        ...$calculationsCount[calcName]?.compounds.values(),
      ];
    } else {
      currentCompoundList = [];
      $selectedCompoundId = null;
    }
  }

  function handleliKey(e: KeyboardEvent) {
    console.log("pressed ", e.key);
  }

  function compoundHandleClick(compoindId: string) {
    $selectedCompoundId = compoindId;
  }
</script>

{#if loading}
  <p>Loading...</p>
{:else}
  <div class="column-list">
    <ul class="column-ul">
      {#each calcNames as calcName}
        <li
          on:click={() => handleliClick(calcName)}
          on:keydown={handleliKey}
          class:selected={calcName === $selectedCalcName}
        >
          <p>{calcName} {$calculationsCount[calcName].size}</p>
        </li>
      {/each}
    </ul>
  </div>
  {#if currentCompoundList.length > 0}
    <div class="drugs-list">
      <ul class="drugs-ul">
        {#each currentCompoundList as drugName, index}
          <li
            class:selected={drugName === $selectedCompoundId}
            data-compound={drugName}
            on:click={() => compoundHandleClick(drugName)}
            on:keydown={() => compoundHandleClick(drugName)}
          >
            {drugName}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
{/if}
