import { derived, writable } from "svelte/store";
import type {
  CalculationDatum,
  CalculationDatumConverted,
  Datum,
  DatumConverted,
  FetchedData,
} from "../types/types";
import { scores } from "../data";
export const dataset = writable<DatumConverted[]>([]);
export const calculationsCount = writable<
  Record<string, { size: number; compounds?: Set<string> }>
>({});

export const heatmapData = derived(dataset, ($dataset) => {
  return $dataset.map((datum) => {
    return scores.map((score) => ({
      score,
      value: datum[score] as number,
    }));
  });
});

export const selectedCalcName = writable<string>("Variants");
export const selectedCompoundId = writable<string | null>(null);

export default function (url: string) {
  const loading = writable(false);
  const error = writable(false);

  async function get() {
    loading.set(true);
    error.set(false);
    try {
      const response = await fetch(url);
      const { data: loadedDataset } = (await response.json()) as FetchedData;

      dataset.set(convertCalcData(loadedDataset));
      const calcCount = getCalculationTypesAndCounts(loadedDataset);
      calculationsCount.set({
        Variants: { size: loadedDataset.length },
        ...calcCount,
      });
    } catch (e) {
      error.set(e);
    } finally {
      loading.set(false);
    }
  }

  get();

  return { loading, error, get };
}

function convertCalcData(dataset: Datum[]): DatumConverted[] {
  const result = dataset.map((d) => {
    const calcData = d.calculation;
    const calcDataConverted = {} as CalculationDatumConverted;
    Object.keys(calcData).forEach((calcType) => {
      calcDataConverted[calcType] = calcData[calcType].reduce((acc, curr) => {
        acc[curr.Compound_ID] = curr;
        return acc;
      }, {} as CalculationDatum);
    });
    return { ...d, calculation: calcDataConverted };
  });

  return result;
}

function getCalculationTypesAndCounts(dataset: Datum[]) {
  const result = {} as Record<
    string,
    { size: number; compounds?: Set<string> }
  >;

  dataset.forEach((d) => {
    Object.keys(d.calculation).forEach((calcType) => {
      const compoundsToAdd = result[calcType]?.compounds || new Set();
      d.calculation[calcType].forEach((compound) => {
        compoundsToAdd.add(compound.Compound_ID);
      });

      result[calcType] = {
        size: (result[calcType]?.size || 0) + 1,
        compounds: compoundsToAdd,
      };
    });
  });

  return result;
}
