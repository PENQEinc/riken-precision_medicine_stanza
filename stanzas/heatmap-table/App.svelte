<script lang="ts">
  import Table from "./Table.svelte";
  import VariantsList from "./VariantsList.svelte";

  export let uniprotAcc,
    assembly,
    genename,
    root: HTMLElement,
    stanzaElement: HTMLElement,
    dataUrl: string;

  import fetchToStore from "./utils/fetchStore";

  const { loading, error } = fetchToStore(dataUrl);

  $: if ($loading) {
    stanzaElement.setAttribute("loading", "");
    dispatchEvent(
      new CustomEvent("stanza-loading-started", {
        detail: { root },
        composed: true,
        bubbles: true,
      })
    );
  } else {
    stanzaElement.removeAttribute("loading");
    dispatchEvent(
      new CustomEvent("stanza-loading-ended", {
        detail: { root },
        composed: true,
        bubbles: true,
      })
    );
  }

  $: if ($error) {
    stanzaElement.setAttribute("error", "");
    dispatchEvent(
      new CustomEvent("stanza-error", {
        detail: { root, error: $error.message },
        composed: true,
        bubbles: true,
      })
    );
  } else {
    stanzaElement.removeAttribute("error");
  }
</script>

<div class="heatmap-table">
  <VariantsList loading={$loading} />
  <Table loading={$loading} />
</div>
