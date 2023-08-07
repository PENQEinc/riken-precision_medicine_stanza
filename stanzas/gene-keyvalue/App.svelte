<script>
  import Fa from "svelte-fa";
  import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
  export let term;

  // define the object structure from api
  let geneData = [
    {
      symbol: term,
      assembly: "",
      chromosome: "",
      position: "",
    },
  ];

  // Get window object
  const handleFetchRequestDone = () => {
    let fetchGeneData = window.$fetchedData.gene;
    geneData = [
      {
        symbol: term,
        assembly: fetchGeneData[0].assembly,
        chromosome: fetchGeneData[0].chromosome,
        position: fetchGeneData[0].position,
      },
    ];
    window.dispatchEvent(new CustomEvent("childHasGotData"));
  };
  window.addEventListener("fetchRequestDone", handleFetchRequestDone);

  // When api is not okay
  // setTimeout(() => {
  //   gene = [
  //     {
  //       assembly: "hg38",
  //       chromosome: "chr1",
  //       position: "123456",
  //     },
  //   ];
  // }, 1000);

  // define the object structure for display
  $: geneList = [
    { key: "Symbol", value: term },
    { key: "Assembly", value: geneData[0].assembly },
    { key: "Chromosome", value: geneData[0].chromosome },
    { key: "Position", value: geneData[0].position },
  ];
</script>

<div class="gene-keyvalue">
  <h3 class="title">Gene Information</h3>
  <table>
    {#each geneList as { key, value }, index}
      <tr>
        <th>{key}</th>
        <td>
          {#if index === 0}
            <a
              href={`${window.location.origin}/genes/details?uniprot_acc=Q9UM73&assembly=grch38&genename=${term}`}
              >{value}
              <Fa
                icon={faCircleChevronRight}
                size="90%"
                color="var(--gene-color)"
              />
            </a>
          {:else}
            {value ? value : "Loading..."}
          {/if}
        </td>
      </tr>
    {/each}
  </table>
</div>
