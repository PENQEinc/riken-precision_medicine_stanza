<script>
  import Fa from "svelte-fa";
  import {
    faCircleChevronRight,
    faTriangleExclamation,
  } from "@fortawesome/free-solid-svg-icons";
  import drugIcon from "@/assets/drug.svg";
  import proteinIcon from "@/assets/protein.svg";

  export let assembly, isPosition, term;
  const grch = `GRCh${assembly.replace(/\D/g, "")}`;
  let promise = search(term);

  async function search(term) {
    let response;
    if (isPosition) {
      response = await fetch(
        // `https://precisionmd-db.med.kyoto-u.ac.jp/api/positions/search?assembly=${assembly}&position=${term}`
        `https://raw.githubusercontent.com/PENQEinc/riken-precision_medicine_stanza/main/stanzas/search-variant/assets/sample.json`
      );
    } else {
      response = await fetch(
        // `https://precisionmd-db.med.kyoto-u.ac.jp/api/variants/search?assembly=${assembly}&variant=${term}`
        `https://raw.githubusercontent.com/PENQEinc/riken-precision_medicine_stanza/main/stanzas/search-variant/assets/sample.json`
      );
    }
    const json = await response.json();
    console.log(json);
    if (response.ok) {
      return json;
    } else {
      throw new Error(json);
    }
  }
</script>

<div class="search-variant">
  <table class="table">
    <thead>
      <tr>
        <th class="th-variant">Name</th>
        <th class="th-disease">MGeND Significance</th>
        <th class="th-disease">ClinVar Significance</th>
        <th class="th-calc">Calculated</th>
      </tr>
    </thead>
    <tbody>
      {#await promise}
        <tr><td colspan="10">Loading...</td></tr>
      {:then dataset}
        {#each dataset.data as { chr, variant, MGeND_ClinicalSignificance, ClinVar_ClinicalSignificance, calculation, end, start, alt, ref, genename, Compound_ID, PDB_ID }}
          <tr>
            <td
              ><a
                class="link-variant"
                href={`${window.location.origin}/dev/variants/details?assembly=${assembly}&chr=${chr}&start=${start}&end=${end}&ref=${ref}&alt=${alt}&variant=${variant}`}
              >
                {`${grch}_${chr}_${start}_${end}_${ref}_${alt}_${variant}`}
                <Fa
                  icon={faCircleChevronRight}
                  size="90%"
                  color="var(--variant-color)"
                />
              </a>
            </td>
            <td>
              {MGeND_ClinicalSignificance.length === 0
                ? ""
                : MGeND_ClinicalSignificance}
            </td>
            <td
              >{ClinVar_ClinicalSignificance.length === 0
                ? ""
                : ClinVar_ClinicalSignificance}
            </td>
            <td class="td-calc">
              <ul>
                {#each Object.keys(calculation) as calc}
                  <li>
                    <img class="icon" src={drugIcon} alt="drug" />
                    {calc}
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
