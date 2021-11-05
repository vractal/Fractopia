import BaseSolidModel from "./BaseSolidModel";
import { space, rdfs } from "rdf-namespaces";

export default class Context extends BaseSolidModel {
  rdfContexts = {
    space: space,
  };

  fieldsSchema = {
    name: {
      type: String,
      rdfType: rdfs.label,
    },
    storage: {
      type: "url?",
      rdfType: space.storage, //private,shared.. como botar?
    },
    tools: {
      type: "relation",
      rdfType: space.preferencesFile,
    },
  };
  defaultNamespace = "";
  referenceSpace = "";
  // tem que indexar contextos em algum lugar

  // tools - formas de vizualizacao/interacao ferramentas da lateral
  //
  constructor() {
    super();
  }

  //
}
