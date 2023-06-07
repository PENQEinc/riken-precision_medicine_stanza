type CalculationType = "MP-CAFFE" | "Mutation_FEP";

type CompoundID = "alectinib" | "crizotinib" | "lorlatinib";

interface CalculationDatum {
  PDB_ID: string;
  FE_Bind: number[];
  Compound_ID: CompoundID;
  FE_Bind_std: number;
  FE_Bind_mean: number;
}

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
  Compound_ID: CompoundID;
  uniprot_acc: string;
  MutationTaster: number;
  Polyphen2_HDIV: number;
  Polyphen2_HVAR: number;
  MutationAssessor: number;
  PDBlist_single_wild: string[];
  MGeND_ClinicalSignificance: string[];
  ClinVar_ClinicalSignificance: string[];
  calculation: {
    [key in CalculationType]: CalculationDatum[];
  };
}

export interface FetchedData {
  data: Datum[];
  size: number;
}
