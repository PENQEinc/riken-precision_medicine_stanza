import Stanza from "togostanza/stanza";
import toCamelCase from "../../lib/CamelCase";
import App from "./App.svelte";

export default class HeatmapTable extends Stanza {
  app = null;

  async render() {
    if (this.app) {
      this.root.querySelector("main > .heatmap-table").remove();
    }
    this.app = new App({
      target: this.root.querySelector("main"),
      props: {
        uniprotAcc: toCamelCase(this.params)["stanzaUniprotAcc"],
        assembly: toCamelCase(this.params)["stanzaAssembly"],
        genename: toCamelCase(this.params)["stanzaGenename"],
        root: this.root.querySelector("main"),
      },
    });
  }
}
