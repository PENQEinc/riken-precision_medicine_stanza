<script lang="ts">
  import getColor from "../../lib/ColorScale";
  import toCamelCase from "../../lib/CamelCase";
  import Fa from "svelte-fa";
  import {
    faCircleChevronRight,
    faTriangleExclamation,
  } from "@fortawesome/free-solid-svg-icons";
  import { calculationType, scores, scoreTheads } from "./data.js";
  import { Datum, FetchedData } from "./types/types";
  import { fetchData } from "./utils/fetchData";
  export let uniprotAcc, assembly, genename, root;

  let {
    dataset,
    compoundMap,
    datasetMa,
    calculationsLists,
    calculationsCount,
  } = fetchData();

  // let dataset = [] as Datum[];
  let calculationsLists = [];
  let calculationsCount = {};
  let datasetMap = new Map<string, Datum[]>();
  let compoundMap = new Map();
  let currentCompoundList = [];
  let selectedCalcName = "variants";
  let currentTabeleList = [] as Datum[];
  let tableSelectedItem = {};

  // const getCalculationsLists = (dataset: Datum[]) => {
  //   const calculations = dataset.flatMap((data) => [
  //     ...Object.keys(data.calculation),
  //   ]);

  //   const uniqueCalculations = [...new Set(calculations.filter(Boolean))];

  //   console.log("uniqueCalculations", uniqueCalculations);
  //   const calculationsCount = calculations.reduce((acc, calcType) => {
  //     acc[calcType] = (acc[calcType] || 0) + 1;
  //     return acc;
  //   }, {});

  //   console.log("Here");

  //   return [uniqueCalculations, calculationsCount];
  // };

  // const getMapLists = () => {
  //   datasetMap = new Map<string, Datum[]>([["variants", dataset]]);
  //   calculationsLists.forEach((calcName) => {
  //     const filteredData = dataset
  //       .filter((data) => !!data.calculation[calcName])
  //       .map((data) => ({
  //         ...data,
  //         calculation: data.calculation[calcName],
  //       }));

  //     datasetMap.set(calcName, filteredData);

  //     const compoundGroup = filteredData.reduce((acc, data) => {
  //       const compound = data.Compound_ID;
  //       if (!acc[compound]) {
  //         acc[compound] = [];
  //       }
  //       acc[compound].push(data);
  //       return acc;
  //     }, {});

  //     console.log("compoundGroup", compoundGroup);
  //     const compoundList = [{ "All Drugs": filteredData, ...compoundGroup }];
  //     compoundMap.set(calcName, ...compoundList);
  //   });

  //   return [datasetMap, compoundMap];
  // };

  // async function fetchData() {
  //   const response = await fetch(
  //     //`https://precisionmd-db.med.kyoto-u.ac.jp/testapi/genes/variants?uniprot_acc=${uniprotAcc}&assembly=${assembly}&genename=${genename}&limit=10000`
  //     //"https://raw.githubusercontent.com/PENQEinc/riken-precision_medicine_stanza/feature/fetch-heatmap/stanzas/heatmap-table/assets/geneVariantSample.json"
  //     //`https://precisionmd-db.med.kyoto-u.ac.jp/api/genes/variants?uniprot_acc=${uniprotAcc}&assembly=${assembly}&genename=${genename}`
  //     "https://raw.githubusercontent.com/PENQEinc/riken-precision_medicine_stanza/feature/fetch-heatmap-anton/stanzas/heatmap-table/assets/geneVariantNewDummy.json"
  //   );

  //   const json = await response.json();

  //   if (response.ok) {
  //     dataset = json.data as Datum[];

  //     currentTabeleList = dataset;
  //     [calculationsLists, calculationsCount] = getCalculationsLists(dataset);

  //     [datasetMap, compoundMap] = getMapLists();

  //     debugger;
  //   } else {
  //     throw new Error(json);
  //   }
  // }

  const initTableSelected = () => {
    if (root.querySelector("tbody")) {
      const trs = root.querySelectorAll("tbody > tr");
      trs.forEach((tr) => {
        const radio = tr.querySelector('input[type="radio"]');
        if (radio.checked) {
          radio.checked = false;
        }
      });
      if (root.querySelector("tbody > tr.selected")) {
        root.querySelector("tbody > tr.selected").classList.remove("selected");
      }
    }
  };

  let selectedCalcEl = null;
  const calcHandleClick = (event) => {
    const clickedItem = event.target.closest("li");
    selectedCalcName = clickedItem.dataset.calc;
    currentTabeleList = datasetMap.get(selectedCalcName);
    currentCompoundList =
      selectedCalcName === "variants"
        ? []
        : Object.keys(compoundMap.get(selectedCalcName));

    if (clickedItem !== selectedCalcEl) {
      clickedItem.parentElement.querySelectorAll("li").forEach((li) => {
        if (li.classList.contains("selected")) {
          li.classList.remove("selected");
        }
      });
      selectedCalcEl = clickedItem;
      selectedCalcEl.classList.add("selected");
      initTableSelected();
    }
  };

  const listHandleKeyDown = (event) => {
    event.preventDefault();
    const ul = event.target.closest("li").parentElement;
    const listItems = ul.querySelectorAll("li");
    let selectedIndex = null;
    listItems.forEach((li, index) => {
      if (li.classList.contains("selected")) {
        selectedIndex = index;
      }
    });

    switch (event.key) {
      case "ArrowUp":
        if (selectedIndex > 0) {
          listItems[selectedIndex].classList.remove("selected");
          listItems[selectedIndex - 1].classList.add("selected");
          selectedCalcEl = listItems[selectedIndex - 1];
        } else {
          listItems[0].classList.remove("selected");
          listItems[listItems.length - 1].classList.add("selected");
          selectedCalcEl = listItems[listItems.length - 1];
        }
        break;

      case "ArrowDown":
        if (selectedIndex < listItems.length - 1) {
          listItems[selectedIndex].classList.remove("selected");
          listItems[selectedIndex + 1].classList.add("selected");
          selectedCalcEl = listItems[selectedIndex + 1];
        } else {
          listItems[listItems.length - 1].classList.remove("selected");
          listItems[0].classList.add("selected");
          selectedCalcEl = listItems[0];
        }
        break;
    }
    selectedCalcName = selectedCalcEl.dataset.calc;
    currentTabeleList = datasetMap.get(selectedCalcName);
    currentCompoundList =
      selectedCalcName === "variants"
        ? ""
        : Object.keys(compoundMap.get(selectedCalcName));
  };

  let selectedCompoundEl = null;
  let selectedCompoundName = "All Drugs";
  const compoundHandleClick = (event) => {
    const clickedItem = event.target.closest("li");
    selectedCompoundName = clickedItem.textContent.trim();
    if (clickedItem !== selectedCompoundEl) {
      clickedItem.parentElement.querySelectorAll("li").forEach((li) => {
        if (li.classList.contains("selected")) {
          li.classList.remove("selected");
        }
      });

      selectedCompoundEl = clickedItem;
      selectedCompoundEl.classList.add("selected");
      currentTabeleList =
        compoundMap.get(selectedCalcName)[selectedCompoundName];
    }

    initTableSelected();
  };
  const updateGraphs = (data) => {
    // TODO: if option is selected that return this function
    if (Object.keys(tableSelectedItem).length !== 0) return;
    window.dispatchEvent(
      new CustomEvent("updateGraphs", {
        // TODO: change to data.variant to data.pdbId (or others)
        detail: {
          hovered: data,
        },
      })
    );
  };
  let tableSelectedEl = null;
  const tableHandleClick = (event, data) => {
    const variantLink = event.target.closest(".td-variant > span");
    const calculationList = event.target.closest(".td-calc > span");
    if (variantLink || calculationList) return;

    const clickedItem = event.target.closest("tr");
    const radioButton = clickedItem.querySelector('input[type="radio"]');
    clickedItem.parentElement.firstChild.classList.remove("selected");
    if (clickedItem !== tableSelectedEl) {
      if (tableSelectedEl) {
        tableSelectedEl.classList.remove("selected");
        tableSelectedEl.querySelector('input[type="radio"]').checked = false;
      }
      tableSelectedEl = clickedItem;
      tableSelectedEl.classList.add("selected");
      radioButton.checked = true;
      tableSelectedItem = data;
      window.dispatchEvent(
        new CustomEvent("updateGraphs", {
          // TODO: change to data.variant to data.pdbId (or others)
          detail: {
            clicked: tableSelectedItem,
          },
        })
      );
    } else {
      tableSelectedEl = null;
      tableSelectedItem = {};
      clickedItem.classList.remove("selected");
      radioButton.checked = false;
    }
  };
</script>

<div class="heatmap-table">
  <!-- Column -->
  <div class="column-list">
    {#if calculationsLists.length > 0}
      <ul class="column-ul">
        <li
          class="selected"
          data-calc={"variants"}
          on:click={calcHandleClick}
          on:keydown={listHandleKeyDown}
          tabindex="-1"
        >
          Variants<span class="num">{dataset.length}</span>
        </li>
        {#each calculationsLists as calc}
          <li
            data-calc={calc}
            on:click={calcHandleClick}
            on:keydown={listHandleKeyDown}
            tabindex="-1"
          >
            <img
              class="icon"
              src={calculationType(calc).src}
              alt={calculationType(calc).alt}
            />{calc}<span class="num">{calculationsCount[calc]}</span>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  {#if calculationType(selectedCalcName).calcName === "mutation"}
    <div class="drugs-list">
      <ul class="drugs-ul">
        {#each currentCompoundList as drugName, index}
          <li
            class={index === 0 ? "selected" : ""}
            data-compound={drugName}
            on:click={compoundHandleClick}
            on:keydown={compoundHandleClick}
          >
            {drugName}
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  <!-- Table -->
  <div class="table-container">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th class="th-gene" rowspan="2">UniProt acc</th>
            <th class="th-variant" rowspan="2">Variant</th>
            <th class="th-variant" rowspan="2">GenBank</th>
            <th class="th-disease th-group" colspan="2">Significance</th>
            {#if calculationType(selectedCalcName).calcName !== "variants"}
              <th class="th-calc th-group" colspan="1"
                ><p>Single Calculation</p></th
              >
              <th class="th-calc th-group" colspan="2"
                ><p>Multiple Calculation</p></th
              >
            {/if}
            <th class="th-calc" rowspan="2">Calculation</th>
            {#each scoreTheads as { className, label }}
              <th class={className} rowspan="2"><p>{label}</p></th>
            {/each}
          </tr>
          <tr>
            <th class="th-disease" rowspan="1">MGeND</th>
            <th class="th-disease" rowspan="1">ClinVar</th>
            {#if calculationType(selectedCalcName).calcName !== "variants"}
              <th class="th-calc" rowspan="1" data-calc="mutation"
                ><p>ΔΔG (kcal/mol)</p></th
              >
              <th class="th-calc" rowspan="1" data-calc="mutation"
                ><p>Average ΔΔG (kcal/mol)</p></th
              >
              <th class="th-calc" rowspan="1" data-calc="mutation"
                ><p>Standard Deviation</p></th
              >
            {/if}
          </tr>
        </thead>
        <tbody>
          {#await dataset}
            <tr><td colspan="3" class="loading-message">Loading...</td></tr>
          {:then json}
            {#each currentTabeleList as data, index}
              <tr
                on:click={(event) => tableHandleClick(event, data)}
                on:focus={() => {
                  updateGraphs(data);
                }}
                on:mouseover={() => {
                  updateGraphs(data);
                }}
              >
                <td class="td-uniprot">
                  <input
                    class="radio-button"
                    type="radio"
                    name="variantid"
                    value={data.uniprot_acc}
                  />
                  {data.uniprot_acc}
                </td>
                <td>
                  <a
                    class="link-variant"
                    href={`${window.location.origin}/dev/variants/details?assembly=${data.assembly}&chr=${data.chr}&start=${data.start}&end=${data.end}&ref=${data.ref}&alt=${data.alt}&variant=${data.variant}`}
                  >
                    {data.variant}<Fa
                      icon={faCircleChevronRight}
                      size="90%"
                      color="var(--variant-color)"
                    /></a
                  >
                </td>
                <td>{data.GenBank[0] === undefined ? "-" : data.GenBank}</td>
                <td
                  >{data.MGeND_ClinicalSignificance[0] === undefined
                    ? ""
                    : data.MGeND_ClinicalSignificance}</td
                >
                <td
                  >{data.ClinVar_ClinicalSignificance[0] === undefined
                    ? ""
                    : data.ClinVar_ClinicalSignificance}</td
                >
                {#if calculationType(selectedCalcName).calcName !== "variants"}
                  {#if data.calculation[0]?.FE_Bind?.length === 0}
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  {:else if data.calculation[0]?.FE_Bind?.length === 1}
                    <td>{data.calculation[0]?.FE_Bind}</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  {:else}
                    <td>&nbsp;</td>
                    <td>{data.calculation[0]?.FE_Bind_mean}</td>
                    <td>{data.calculation[0]?.FE_Bind_std}</td>
                  {/if}
                {/if}
                <td>
                  <!-- {#each data.calculation as calculation}
                    <a
                      class="link-calc"
                      href={`${window.location.origin}/dev/calculation/details?assembly=${data.assembly}&genename=${data.genename}&calculation_type=${calculation.calculation_type}&Compound_ID=${data.compoundId}&PDB_ID=${calculation.PDB_ID}&variant=${data.variant}`}
                    >
                      <img
                        class="icon"
                        src={calculationType(calculation.calculation_type).src
                          ? calculationType(calculation.calculation_type).src
                          : ""}
                        alt={calculationType(calculation.calculation_type).alt
                          ? calculationType(calculation.calculation_type).alt
                          : ""}
                      /><span>{calculation.calculation_type}</span>
                    </a>
                    <br />
                  {/each} -->
                </td>
                {#each scores as key}
                  <td class="cell-td"
                    ><div
                      class="cell"
                      style="background-color:{getColor(data[key])}"
                    /></td
                  >
                {/each}
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
                Unable to fetch data from the server. Please refresh the page or
                try again later.<br />
              </td></tr
            >
          {/await}
        </tbody>
      </table>
    </div>
    <div class="legend">
      <p>Benign</p>
      <div class="legend-bar" />
      <p>Pathogenic</p>
    </div>
  </div>
</div>
