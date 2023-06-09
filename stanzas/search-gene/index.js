import Stanza from "togostanza/stanza";
import toCamelCase from "../../lib/CamelCase";
import App from "./App.svelte";

export default class SearchGene extends Stanza {
  app = null;

  async render() {
    if (this.app) {
      this.root.querySelector("main > .search-gene").remove();
    }
    this.app = new App({
      target: this.root.querySelector("main"),
      props: {
        assembly: toCamelCase(this.params)["stanzaAssembly"],
        term: toCamelCase(this.params)["stanzaTerm"],
        root: this.root.querySelector("main"),
      },
    });
  }
}
