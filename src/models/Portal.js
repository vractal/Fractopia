import BaseSolidModel from "./BaseSolidModel";
import { space, rdfs } from "rdf-namespaces";
import fractopia from "@/vocabulary/fractopia";
export default class Context extends BaseSolidModel {
  // rdfContexts = {
  //   space: space,
  // };

  name;
  type;
  portals = [];
  defaultStorage = null; //  default path related to the portal. optional
  defaultIndexPath = null;
  fieldsSchema = {
    name: {
      type: String,
      rdfType: rdfs.label,
    },
    tools: {
      type: "relation",
      rdfType: fractopia.relations.subPortal,
      target: fractopia.Portal,
    },
    targetStorage: {
      type: "relation",
      rdfType: space.storage,
      // ou workspace ou pathurl simples
    },
    // filters (datatypes, shapes, etc) nas listas e galerias e grafos
    // hiperpastas
    // modulos de vizualizacao e interacao (de um ou de varios)
    // descricao da tela (como e onde as coisas tao)
    // outras preferencias que podem ser especificas de aplicacoes
  };
  rdfsClasses = [fractopia.Portal];

  defaultNamespace = "";
  referenceSpace = "";
  // tem que indexar contextos em algum lugar

  // tools - formas de vizualizacao/interacao ferramentas da lateral
  //
  constructor({ name, targetSpace, tools, url }) {
    super();
    this.name = name;
    this.tools = tools || [];
    this.targetSpace = targetSpace;
    this.url = url;
  }

  //
}
this;
