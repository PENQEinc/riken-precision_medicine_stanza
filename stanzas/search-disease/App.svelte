<script>
  import Fa from "svelte-fa";
  import {
    faCircleChevronRight,
    faTriangleExclamation,
  } from "@fortawesome/free-solid-svg-icons";
  import drugIcon from "@/assets/drug.svg";
  import proteinIcon from "@/assets/protein.svg";
  export let assembly, term;
  let promise = search(term);

  async function search(disease) {
    const response = await fetch(
      `https://precisionmd-db.med.kyoto-u.ac.jp/api/positions/search?assembly=${assembly}&disease=${disease}`
    );
    const json = await response.json();
    if (response.ok) {
      return json;
    } else {
      throw new Error(json);
    }
  }
</script>

<div class="search-disease">
  <table class="table">
    <thead>
      <tr>
        <th class="th-disease">Name (MGeND)</th>
        <th class="th-disease">Name (ClinVar)</th>
        <th class="th-gene">Gene</th>
        <th class="th-gene">UniProt Accession</th>
        <th class="th-variant">Variant</th>
        <th class="th-disease">MGeND Significance</th>
        <th class="th-disease">ClinVar Significance</th>
        <th class="th-calc">Calculated</th>
      </tr>
    </thead>
    <tbody>
      {#await promise}
        <tr><td colspan="10">Loading...</td></tr>
      {:then dataset}
        {#each dataset.data as { MGeND_DiseaseName, ClinVar_DiseaseName, genename, uniprot_acc, variant, MGeND_ClinicalSignificance, ClinVar_ClinicalSignificance, calculation_type, assembly, chr, alt, ref, start, end, Compound_ID, PDB_ID }}
          <tr>
            <td class="td-disease">{@html MGeND_DiseaseName.join("<br>")}</td>
            <td class="td-disease">{@html ClinVar_DiseaseName.join("<br>")}</td>
            <td
              ><a
                class="link-gene"
                href={`${window.location.origin}/dev/genes/details?uniprot_acc=${uniprot_acc}&assembly=${assembly}&genename=${genename}`}
                >{genename}<Fa
                  icon={faCircleChevronRight}
                  size="90%"
                  color="var(--gene-color)"
                />
              </a></td
            >
            <td> {uniprot_acc}</td>
            <td
              ><a
                class="link-variant"
                href={`${
                  window.location.origin
                }/dev/variants/details?assembly=${assembly}&chr=${
                  chr ? chr : "chr2"
                }&start=${start}&end=${end}&alt=${alt}&ref=${ref}&variant=${variant}`}
                >{variant}<Fa
                  icon={faCircleChevronRight}
                  size="90%"
                  color="var(--variant-color)"
                />
              </a></td
            >
            <td>
              {MGeND_ClinicalSignificance.length === 0
                ? "-"
                : MGeND_ClinicalSignificance}</td
            >
            <td
              >{ClinVar_ClinicalSignificance.length === 0
                ? "-"
                : ClinVar_ClinicalSignificance}</td
            >
            <td class="td-calc"
              >{#if calculation_type.length > 0}
                {#each calculation_type as calc}
                  <a
                    class="link-calc"
                    href={`${window.location.origin}/dev/calculation/details?assembly=${assembly}&genename=${genename}&calculation_type=${calc}&Compound_ID=${Compound_ID}&PDB_ID=${PDB_ID}&variant=${variant}`}
                  >
                    <img class="icon" src={drugIcon} alt="drug" />
                    {calc}
                    <Fa
                      icon={faCircleChevronRight}
                      size="90%"
                      color="var(--calc-color)"
                    />
                  </a>
                {/each}
              {/if}
            </td>
          </tr>
        {/each}
      {:catch error}
        <tr
          ><td class="error-message" colspan="10"
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
