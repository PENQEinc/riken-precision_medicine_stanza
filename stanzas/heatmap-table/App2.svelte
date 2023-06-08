<script lang="ts">
  import Table from "./Table.svelte";
  import VariantsList from "./VariantsList.svelte";

  export let uniprotAcc, assembly, genename, root;

  import fetchToStore, { selectedCalcName } from "./utils/fetchStore";

  const { loading, error } = fetchToStore(
    "https://raw.githubusercontent.com/PENQEinc/riken-precision_medicine_stanza/feature/fetch-heatmap-anton/stanzas/heatmap-table/assets/geneVariantNewDummy.json"
  );

  $selectedCalcName = "Variants";
</script>

<div class="heatmap-table">
  <VariantsList loading={$loading} />
  <Table />
</div>
