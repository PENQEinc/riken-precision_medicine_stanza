<script>
  import Fa from "svelte-fa";
  import {
    faCircleChevronRight,
    faTriangleExclamation,
  } from "@fortawesome/free-solid-svg-icons";
  import drugIcon from "@/assets/drug.svg";
  // import proteinIcon from "@/assets/protein.svg";
  export let assembly, term;
  let promise = search(term);

  async function search(geneName) {
    const response = await fetch(
      `https://precisionmd-db.med.kyoto-u.ac.jp/api/genes/search?assembly=${assembly}&genename=${geneName}&limit=300`
    );
    const json = await response.json();
    if (response.ok) {
      return json;
    } else {
      throw new Error(json);
    }
  }
</script>

<div class="search-gene">
  <table class="table">
    <thead>
      <tr>
        <th class="th-gene">Name</th>
        <th class="th-gene">UniProt Accession</th>
        <th class="th-calc">Calculated</th>
      </tr>
    </thead>
    <tbody>
      {#await promise}
        <tr><td colspan="3">Loading...</td></tr>
      {:then dataset}
        {#each dataset.data as { genename, uniprot_acc, calculation_type }}
          <tr>
            <td
              ><a
                class="link-gene"
                href={`${window.location.origin}/dev/genes/details?assembly=${assembly}&genename=${genename}&uniprot_acc=${uniprot_acc}`}
                >{genename}<Fa
                  icon={faCircleChevronRight}
                  size="90%"
                  color="var(--gene-color)"
                />
              </a></td
            >
            <td>{uniprot_acc}</td>
            <td>
              {#if calculation_type.length > 0}
                {#each calculation_type as calc}
                  <img class="icon" src={drugIcon} alt="drug" />
                  {calc}
                {/each}
              {/if}
            </td>
          </tr>
        {/each}
      {:catch error}
        <tr
          ><td class="error-message" colspan="3"
            ><Fa
              icon={faTriangleExclamation}
              size="90%"
              color="var(--warning-color)"
            />
            Unable to fetch data from the server. Please refresh the page or try
            again later.<br />
          </td></tr
        >
      {/await}
    </tbody>
  </table>
</div>
