import Stanza from "togostanza/stanza";
import toCamelCase from "../../lib/CamelCase";

export default class Popup extends Stanza {
  app = null;

  async render() {
    console.log(this.root.childNodes);
  }
}
