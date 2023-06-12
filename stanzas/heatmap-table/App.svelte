<script lang="ts">
  import Table from "./Table.svelte";
  import VariantsList from "./VariantsList.svelte";

  export let uniprotAcc,
    assembly,
    genename,
    root,
    stanzaElement: HTMLElement,
    dataUrl: string;

  import fetchToStore from "./utils/fetchStore";

  const { loading, error } = fetchToStore(dataUrl);

  $: if ($loading) {
    stanzaElement.setAttribute("loading", "");
  } else {
    stanzaElement.removeAttribute("loading");
  }

  $: if ($error) {
    stanzaElement.setAttribute("error", "");
  } else {
    stanzaElement.removeAttribute("error");
  }
</script>

<div class="heatmap-table">
  <VariantsList loading={$loading} />
  <Table loading={$loading} />
</div>
