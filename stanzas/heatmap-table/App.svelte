<script>
  import getColor from "../../lib/ColorScale";
  import toCamelCase from "../../lib/CamelCase";
  import Fa from "svelte-fa";
  import {
    faCircleChevronRight,
    faTriangleExclamation,
  } from "@fortawesome/free-solid-svg-icons";
  import { calculationType, scores, scoreTheads } from "./data.js";
  export let uniprotAcc, assembly, genename, root;
  let promise = fetchData();

  let dataset = [];
  let calculationsCount = {};
  let calculationsLists = [];
  let drugList = [];
  let datasetMap = [];
  let drugListMap = new Map();
  let selectDrugList = [];
  let selectedListName = "variants";
  let currentTabeList = [];

  const getCalculationsLists = (dataset) => {
    let calculations = [];
    dataset.forEach((data) =>
      data.calculationType.forEach((d) => calculations.push(d))
    );
    calculationsCount = calculations.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});
    return [...new Set(calculations.filter(Boolean))];
  };

  const getdrugList = (dataset) => [
    ...new Set(dataset.map((d) => d.compoundId).filter(Boolean)),
  ];

  async function fetchData() {
    const response = await fetch(
      `https://precisionmd-db.med.kyoto-u.ac.jp/api/genes/variants?uniprot_acc=${uniprotAcc}&assembly=${assembly}&genename=${genename}`
    );
    const json = await response.json();
    if (response.ok) {
      dataset = json.data.map(toCamelCase);
      currentTabeList = dataset;
      calculationsLists = getCalculationsLists(dataset);

      datasetMap = new Map([["variants", dataset]]);

      calculationsLists.forEach((calc) => {
        const filteredData = dataset.filter((d) =>
          d.calculationType.includes(calc)
        );
        datasetMap.set(calc, filteredData);

        // Create a crossing list with drugs
        if (calculationType(calc).calcName === "mutation") {
          drugListMap.set(calc, getdrugList(datasetMap.get(calc)));
        }
      });
      drugList = getdrugList(dataset);
      return json;
    } else {
      throw new Error(json);
    }
  }

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

  let selectedListEl = null;
  const listHandleClick = (event) => {
    const clickedItem = event.target.closest("li");
    selectedListName = clickedItem.dataset.calc;
    selectDrugList = drugListMap.get(selectedListName);
    currentTabeList = datasetMap.get(selectedListName);
    if (clickedItem !== selectedListEl) {
      const ul = clickedItem.parentElement;
      const listItems = ul.querySelectorAll("li");
      listItems.forEach((li) => {
        if (li.classList.contains("selected")) {
          li.classList.remove("selected");
        }
      });
      selectedListEl = clickedItem;
      selectedListEl.classList.add("selected");
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
          selectedListEl = listItems[selectedIndex - 1];
        } else {
          listItems[0].classList.remove("selected");
          listItems[listItems.length - 1].classList.add("selected");
          selectedListEl = listItems[listItems.length - 1];
        }
        break;

      case "ArrowDown":
        if (selectedIndex < listItems.length - 1) {
          listItems[selectedIndex].classList.remove("selected");
          listItems[selectedIndex + 1].classList.add("selected");
          selectedListEl = listItems[selectedIndex + 1];
        } else {
          listItems[listItems.length - 1].classList.remove("selected");
          listItems[0].classList.add("selected");
          selectedListEl = listItems[0];
        }
        break;
    }
    selectedListName = selectedListEl.dataset.calc;
    currentTabeList = datasetMap.get(selectedListName);
    selectDrugList = drugListMap.get(selectedListName);
  };

  let selectedDrug = null;
  let currentMutationTabeList = [];
  const drugsHandleClick = (event) => {
    const clickedItem = event.target.closest("li");
    const currentDrugDataset = datasetMap.get(selectedListName);
    currentMutationTabeList = [];

    if (clickedItem !== selectedDrug) {
      if (selectedDrug) {
        selectedDrug.classList.remove("selected");
        currentMutationTabeList = [];
      }
      selectedDrug = clickedItem;
      selectedDrug.classList.add("selected");

      currentDrugDataset.forEach((data) => {
        if (data.compoundId === clickedItem.dataset.compound) {
          currentMutationTabeList.push(data);
        }
      });
      currentTabeList = currentMutationTabeList;
    } else {
      selectedDrug = null;
      clickedItem.classList.remove("selected");
      currentTabeList = currentDrugDataset;
    }

    initTableSelected();
  };

  let tableSelectedItem = null;
  const tableHandleClick = (event, data) => {
    const variantLink = event.target.closest(".td-variant > span");
    const calculationList = event.target.closest(".td-calc > span");
    if (variantLink || calculationList) return;

    const clickedItem = event.target.closest("tr");
    const radioButton = clickedItem.querySelector('input[type="radio"]');
    clickedItem.parentElement.firstChild.classList.remove("selected");
    if (clickedItem !== tableSelectedItem) {
      if (tableSelectedItem) {
        tableSelectedItem.classList.remove("selected");
        tableSelectedItem.querySelector('input[type="radio"]').checked = false;
      }
      tableSelectedItem = clickedItem;
      tableSelectedItem.classList.add("selected");
      radioButton.checked = true;
      window.dispatchEvent(
        new CustomEvent("updateMolstar", {
          // TODO: change to data.variant to data.pdbId (or others)
          detail: { pdbId: data.variant },
        })
      );
    } else {
      tableSelectedItem = null;
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
          on:click={listHandleClick}
          on:keydown={listHandleKeyDown}
          tabindex="-1"
        >
          Variants<span class="num">{dataset.length}</span>
        </li>
        {#each calculationsLists as calc}
          <li
            data-calc={calc}
            on:click={listHandleClick}
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
  {#if calculationType(selectedListName).calcName === "mutation"}
    <div class="drugs-list">
      <h3>Drugs</h3>
      {#if drugList.length > 0}
        <ul class="drugs-ul">
          {#each selectDrugList as drugName, index}
            <li
              class={index === 0 ? "selected" : ""}
              data-compound={drugName}
              on:click={drugsHandleClick}
              on:keydown={drugsHandleClick}
            >
              {drugName}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}

  <!-- Table -->
  <div class="table-container">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th class="th-gene" rowspan="2">UniProt Accession</th>
            <th class="th-variant" rowspan="2">Variant</th>
            <th class="th-variant" rowspan="2">GenBank</th>
            <th class="th-disease th-group" colspan="2">Significance</th>
            {#if calculationType(selectedListName).calcName !== "variants"}
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
            {#if calculationType(selectedListName).calcName !== "variants"}
              <th class="th-calc" rowspan="1" data-calc="mutation"
                ><p>ΔΔG (cal/mol)</p></th
              >
              <th class="th-calc" rowspan="1" data-calc="mutation"
                ><p>Average ΔΔG (cal/mol)</p></th
              >
              <th class="th-calc" rowspan="1" data-calc="mutation"
                ><p>Standard Deviation</p></th
              >
            {/if}
          </tr>
        </thead>
        <tbody>
          {#await promise}
            <tr><td colspan="3" class="loading-message">Loading...</td></tr>
          {:then json}
            {#each currentTabeList as data, index}
              <tr on:click={(event) => tableHandleClick(event, data)}>
                <td class="td-uniprot">
                  <input
                    class="radio-button"
                    type="radio"
                    name="variantid"
                    value={data.uniprotAcc}
                  />
                  {data.uniprotAcc}
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
                <td>{data.genBank[0] === undefined ? "-" : data.genBank}</td>
                <td
                  >{data.mGeNdClinicalSignificance[0] === undefined
                    ? "-"
                    : data.mGeNdClinicalSignificance}</td
                >
                <td
                  >{data.clinVarClinicalSignificance[0] === undefined
                    ? "-"
                    : data.clinVarClinicalSignificance}</td
                >
                {#if calculationType(selectedListName).calcName !== "variants"}
                  {#if data.feBind.length === 0}
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  {:else if data.feBind.length === 1}
                    <td>{data.feBind}</td>
                    <td>-</td>
                    <td>-</td>
                  {:else}
                    <td>-</td>
                    <td>{data.feBindMean}</td>
                    <td>{data.feBindStd}</td>
                  {/if}
                {/if}
                <td>
                  <a
                    class="link-calc"
                    href={`${window.location.origin}/dev/calculation/details?assembly=${data.assembly}&genename=${data.genename}&calculation_type=${data.calculationType}&Compound_ID=${data.compoundId}&PDB_ID=${data.pdbId}&variant=${data.variant}`}
                  >
                    <!-- 以下を.toString()にしているが、配列で複数になるはずなので変更する -->
                    <img
                      class="icon"
                      src={calculationType(data.calculationType.toString()).src
                        ? calculationType(data.calculationType.toString()).src
                        : ""}
                      alt={calculationType(data.calculationType.toString()).alt
                        ? calculationType(data.calculationType.toString()).alt
                        : ""}
                    />
                    {data.calculationType.toString()
                      ? data.calculationType.toString()
                      : ""}
                    {#if calculationType(data.calculationType.toString()).calcName !== ""}
                      <Fa
                        icon={faCircleChevronRight}
                        size="90%"
                        color="var(--calc-color)"
                      />
                    {/if}
                  </a>
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
