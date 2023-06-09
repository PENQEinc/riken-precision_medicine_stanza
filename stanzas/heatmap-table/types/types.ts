export type CalculationDatum = {
  PDB_ID: string;
  FE_Bind: number[];
  Compound_ID: string;
  FE_Bind_std: number;
  FE_Bind_mean: number;
};

export type CalculationDatumConverted = { [key: string]: CalculationDatum };

export interface Datum {
  LRT: number;
  alt: string;
  chr: string;
  end: number;
  ref: string;
  CADD: number;
  REVEL: number;
  start: number;
  SIFT4G: number;
  GenBank: string;
  PROVEAN: number;
  variant: string;
  assembly: string;
  genename: string;
  PrimateAI: number;
  "fathmm-MKL": number;
  uniprot_acc: string;
  MutationTaster: number;
  Polyphen2_HDIV: number;
  Polyphen2_HVAR: number;
  MutationAssessor: number;
  PDBlist_single_wild: string[];
  MGeND_ClinicalSignificance: string[];
  ClinVar_ClinicalSignificance: string[];
  calculation: {
    [key: string]: CalculationDatum[];
  };
}

export type DatumConverted = Omit<Datum, "calculation"> & {
  calculation: CalculationDatumConverted;
};

export interface FetchedData {
  data: Datum[];
  size: number;
}

export type HeatmapDataRow = { score: string; value: number }[];

export type Counts = Record<
  string,
  { size: number; compounds?: { [key: string]: number } }
>;
