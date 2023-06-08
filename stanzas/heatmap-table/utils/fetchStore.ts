import { writable } from "svelte/store";
import { Datum, FetchedData } from "../types/types";

export const dataset = writable<Datum[]>([]);
export const calculationsCount = writable<
  Record<string, { size: number; compounds?: Set<string> }>
>({});

export const selectedCalcName = writable<string | null>(null);
export const selectedCompoundId = writable<string | null>(null);

export default function (url: string) {
  const loading = writable(false);
  const error = writable(false);

  async function get() {
    loading.set(true);
    error.set(false);
    try {
      const response = await fetch(url);
      const { data: loadedDataset, size } =
        (await response.json()) as FetchedData;
      dataset.set(loadedDataset);
      const calcCount = getCalculationTypesAndCounts(loadedDataset);
      calculationsCount.set({ Variants: { size }, ...calcCount });
    } catch (e) {
      error.set(e);
    } finally {
      loading.set(false);
    }
  }

  get();

  return { dataset, calculationsCount, loading, error, get };
}

function getCalculationTypesAndCounts(dataset: Datum[]) {
  const result = {} as Record<
    string,
    { size: number; compounds?: Set<string> }
  >;

  dataset.forEach((d) => {
    Object.keys(d.calculation).forEach((calcType) => {
      result[calcType] = {
        size: (result[calcType]?.size || 0) + 1,
        compounds: (result[calcType]?.compounds || new Set()).add(
          d.Compound_ID
        ),
      };
    });
  });

  return result;
}
