import BaseThing from "./BaseThing";
import { schema, rdfs } from "rdf-namespaces";
import fractopia from "@/vocabulary/fractopia";
import HiperFolder from "./HiperFolder";

export default class Portal extends BaseThing {

  rdfsClasses = [fractopia.Portal];
  static defaultCollectionPrefix = "portals/";
  static nameForSoloThing = 'self'


  name;
  type;
  subPortals = [];
  defaultStorage = null; //  default path related to the portal. optional
  defaultIndexPath = null;

  childClass = Portal
  static ContainerClass = HiperFolder
  ContainerClass = HiperFolder


  static fieldsSchema = {
    ...BaseThing.baseFieldsSchema,
    name: {
      type: 'string',
      rdfType: rdfs.label,
      required: true
    },
    description: {
      type: 'string',
      rdfType: schema.text
    },
    subPortals: {
      type: 'array-string',
      rdfType: fractopia.relations.subPortal
    },
    portalInterface: {
      type: 'string',
      rdfType: fractopia.relations.portalInterface,
      targetType: fractopia.PortalInterface,
      required: true
    },
    targetGraph: {
      type: 'string',
      rdfType: fractopia.relations.portalInterface,
    },
    defaultSubPortal: {
      type: 'string',
      rdfType: fractopia.relations.defaultSubPortal
    }
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
  constructor({ id, url, datasetUrl, name, description, portalInterface, subPortals, defaultSubPortal, ...other }) {
    super(other);

    this.portalInterface = portalInterface;
    this.subPortals = subPortals || []
    this.defaultSubPortal = defaultSubPortal;
    this.name = name;
    this.description = description || [];
    this.solveUrl({ id, url, datasetUrl })
  }

}
