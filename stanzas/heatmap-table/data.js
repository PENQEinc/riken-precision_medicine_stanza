import drugIcon from "@/assets/drug.svg";
// import proteinIcon from "@/assets/protein.svg";
export const calculationType = (dataType) => {
  switch (dataType) {
    case "variants":
      return {
        calcName: "variants",
      };
    case "Mutation_FEP":
    case "MP-CAFEE":
      return {
        calcName: "mutation",
        className: "drug-icon",
        src: drugIcon,
        alt: "drug icon",
      };
    default:
      return {
        calcName: "",
        // className: "protein-icon",
        // src: proteinIcon,
        // alt: "protein icon",
      };
  }
};

export const scores = [
  "CADD",
  "fathmm-MKL",
  "LRT",
  "MutationTaster",
  "MutationAssessor",
  "Polyphen2_HDIV",
  "Polyphen2_HVAR",
  "PrimateAI",
  "PROVEAN",
  "REVEL",
  "SIFT4G",
];

export const scoreTheads = [
  { className: "th-heatmap", label: "CADD" },
  { className: "th-heatmap", label: "fathmm-MKL" },
  { className: "th-heatmap", label: "LRT" },
  { className: "th-heatmap", label: "MutationTaster" },
  { className: "th-heatmap", label: "MutationAssessor" },
  { className: "th-heatmap", label: "Polyphen2_HDIV" },
  { className: "th-heatmap", label: "Polyphen2_HVAR" },
  { className: "th-heatmap", label: "PrimateAI" },
  { className: "th-heatmap", label: "PROVEAN" },
  { className: "th-heatmap", label: "REVEL" },
  { className: "th-heatmap", label: "SIFT4G" },
];
