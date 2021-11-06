import BaseSolidModel from "./BaseSolidModel";
import { space, rdfs } from "rdf-namespaces";

export default class Context extends BaseSolidModel {
  // rdfContexts = {
  //   space: space,
  // };

  fieldsSchema = {
    name: {
      type: String,
      rdfType: rdfs.label,
    },
    tools: {
      type: "relation",
      rdfType: space.preferencesFile,
    },
  };
  rdfsClasses = [space.Workspace]

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
