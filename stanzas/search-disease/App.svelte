<script lang="ts">
  import Fa from "svelte-fa";
  import {
    faCircleChevronRight,
    faTriangleExclamation,
  } from "@fortawesome/free-solid-svg-icons";
  import TextWithIcon from "@/lib/TextWithIcon.svelte";
  import Popup from "@/lib/popup/Popup.svelte";
  import drugIcon from "@/assets/drug.svg";
  import proteinIcon from "@/assets/protein.svg";
  import { upperFirst } from "lodash";
  export let assembly, term;
  let promise = search(term);

  let refs = [] as HTMLElement[];

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
        {#each dataset.data as { MGeND_DiseaseName, ClinVar_DiseaseName, genename, uniprot_acc, variant, MGeND_ClinicalSignificance, ClinVar_ClinicalSignificance, calculation, assembly, chr, alt, ref, start, end }}
          <tr>
            <td class="td-disease">{@html MGeND_DiseaseName.join("<br>")}</td>
            <td class="td-disease">{@html ClinVar_DiseaseName.join("<br>")}</td>
            <td class="td-gene"
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
            <td class="td-variant">
              {#if ClinVar_ClinicalSignificance.length > 0 && alt && ref}
                <a
                  class="link-variant"
                  href={`${window.location.origin}/dev/variants/details?assembly=${assembly}&chr=${chr}&start=${start}&end=${end}&alt=${alt}&ref=${ref}&variant=${variant}`}
                  >{variant}
                  <Fa
                    icon={faCircleChevronRight}
                    size="90%"
                    color="var(--variant-color)"
                  />
                </a>
              {:else}
                {variant}
              {/if}
            </td>
            <td>
              {MGeND_ClinicalSignificance.length === 0
                ? ""
                : MGeND_ClinicalSignificance}</td
            >
            <td
              >{ClinVar_ClinicalSignificance.length === 0
                ? ""
                : ClinVar_ClinicalSignificance}</td
            >
            <td class="td-calc">
              <ul>
                {#each Object.keys(calculation) as calcName, index}
                  <li class="li-calc" bind:this={refs[index]}>
                    <Popup popperParams={{ placement: "top" }}>
                      <ul class="compound-list" slot="tooltip">
                        {#each calculation[calcName] as { Compound_ID, PDB_ID }}
                          <li>
                            <a
                              class="link-calc"
                              href={`${window.location.origin}/dev/calculation/details?assembly=${assembly}&genename=${genename}&calculation_type=${calcName}&Compound_ID=${Compound_ID}&PDB_ID=${PDB_ID}&variant=${variant}`}
                            >
                              {upperFirst(Compound_ID)}
                            </a>
                          </li>
                        {/each}
                      </ul>
                      <TextWithIcon
                        text={calcName}
                        iconAlt={calcName}
                        slot="trigger"
                        icon={drugIcon}
                      >
                        <Fa
                          icon={faCircleChevronRight}
                          size="90%"
                          color="var(--calc-color)"
                        />
                      </TextWithIcon>
                    </Popup>
                  </li>
                {/each}
              </ul>
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
