import { Datum } from "../types/types";

function getCalculationsLists(
  dataset: Datum[]
): [string[], Record<string, number>] {
  const calculations = dataset.flatMap((data) => [
    ...Object.keys(data.calculation),
  ]);

  const uniqueCalculations = [...new Set(calculations.filter(Boolean))];

  const calculationsCount = calculations.reduce((acc, calcType) => {
    acc[calcType] = (acc[calcType] || 0) + 1;
    return acc;
  }, {});

  return [uniqueCalculations, calculationsCount];
}

function getMapLists(dataset: Datum[], calculationsLists: string[]) {
  const datasetMap = new Map<string, Datum[]>([["variants", dataset]]);

  const compoundMap = new Map<string, Record<string, Datum[]>>();

  calculationsLists.forEach((calcName) => {
    const filteredData = dataset
      .filter((data) => !!data.calculation[calcName])
      .map((data) => ({
        ...data,
        calculation: data.calculation[calcName],
      }));

    datasetMap.set(calcName, filteredData);

    const compoundGroup = filteredData.reduce((acc, data) => {
      const compound = data.Compound_ID;
      if (!acc[compound]) {
        acc[compound] = [];
      }
      acc[compound].push(data);
      return acc;
    }, {});

    const compoundList = { "All Drugs": filteredData, ...compoundGroup };
    compoundMap.set(calcName, compoundList);
  });

  return [datasetMap, compoundMap];
}

export async function fetchData() {
  const response = await fetch(
    //`https://precisionmd-db.med.kyoto-u.ac.jp/testapi/genes/variants?uniprot_acc=${uniprotAcc}&assembly=${assembly}&genename=${genename}&limit=10000`
    //"https://raw.githubusercontent.com/PENQEinc/riken-precision_medicine_stanza/feature/fetch-heatmap/stanzas/heatmap-table/assets/geneVariantSample.json"
    //`https://precisionmd-db.med.kyoto-u.ac.jp/api/genes/variants?uniprot_acc=${uniprotAcc}&assembly=${assembly}&genename=${genename}`
    "https://raw.githubusercontent.com/PENQEinc/riken-precision_medicine_stanza/feature/fetch-heatmap-anton/stanzas/heatmap-table/assets/geneVariantNewDummy.json"
  );

  const json = await response.json();

  if (response.ok) {
    const dataset = json.data as Datum[];
    const [calculationsLists, calculationsCount] =
      getCalculationsLists(dataset);

    const [datasetMap, compoundMap] = getMapLists(dataset, calculationsLists);

    return {
      dataset,
      calculationsLists,
      calculationsCount,
      datasetMap,
      compoundMap,
    };
  } else {
    throw new Error("Error fetching data: " + response.status);
  }
}
