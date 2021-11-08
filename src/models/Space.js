import { space, rdfs, schema, solid } from 'rdf-namespaces'
import BaseThing from "./BaseThing";

export default class Space extends BaseThing {
  rdfsClasses = [space.Workspace];
  static defaultCollectionPrefix = "";
  // static nameForSoloThing = 'space'
  static oneThingPerDataset = false;

  static get defaultCollectionUrl() {
    return store.getters["auth/fullFractopiaStorageUrl"] + this.defaultCollectionPrefix
  }

  id = 'spaces'
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
    storage: {
      type: 'url',
      rdfType: space.storage
    },
    portalIndex: {
      type: 'url',
      rdfType: solid.TypeIndex
    },
    defaultIndexFolder: {
      type: 'url',
      rdfType: solid.TypeIndex
    }
  }
  // name of the space
  // description
  // storage - that determines which group
  // belongs to person or group
  //
}
