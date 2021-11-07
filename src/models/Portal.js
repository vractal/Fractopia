import BaseThing from "./BaseThing";
import { schema, rdfs } from "rdf-namespaces";
import fractopia from "@/vocabulary/fractopia";
export default class Portal extends BaseThing {

  rdfsClasses = [fractopia.Portal];
  static defaultCollectionPrefix = "portals/";
  static nameForSoloThing = 'self'

  name;
  type;
  portals = [];
  defaultStorage = null; //  default path related to the portal. optional
  defaultIndexPath = null;
  childClass = Portal
  static fieldsSchema = {
    ...BaseThing.baseFieldsSchema,
    name: {
      type: 'string',
      rdfType: rdfs.label,
    },
    description: {
      type: 'string',
      rdfType: schema.text
    },
    // portals: {
    //   type: "relation",
    //   rdfType: fractopia.relations.subPortal,
    //   target: fractopia.Portal,
    // },
    // targetGraph: {
    //   type: "relation",
    //   rdfType: space.storage,
    //   // ou workspace ou pathurl simples
    // },
    // filters (datatypes, shapes, etc) nas listas e galerias e grafos
    // hiperpastas
    // modulos de vizualizacao e interacao (de um ou de varios)
    // descricao da tela (como e onde as coisas tao)
    // outras preferencias que podem ser especificas de aplicacoes
  };


  // tem que indexar contextos em algum lugar

  // tools - formas de vizualizacao/interacao ferramentas da lateral
  //
  constructor({ id, url, datasetUrl, name, description, ...other }) {
    super(other);
    this.name = name;
    this.description = description || [];
    super.solveUrl({ id, url, datasetUrl })
  }

}
