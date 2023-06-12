import Stanza from "togostanza/stanza";
import toCamelCase from "../../lib/CamelCase";
import App from "./App.svelte";

export default class HeatmapTable extends Stanza {
  app = null;

  async render() {
    if (this.app) {
      this.root.querySelector("main > .heatmap-table").remove();
    }

    const camelCaseParams = toCamelCase(this.params);

    this.app = new App({
      target: this.root.querySelector("main"),
      props: {
        uniprotAcc: camelCaseParams["stanzaUniprotAcc"],
        assembly: camelCaseParams["stanzaAssembly"],
        genename: camelCaseParams["stanzaGenename"],
        dataUrl: camelCaseParams["stanzaDataurl"],
        stanzaElement: this.element,
        root: this.root.querySelector("main"),
      },
    });
  }
}
