import { getSolidDataset, getThingAll, getUrl } from '@inrupt/solid-client';
import { space, rdfs, schema, solid, rdf } from 'rdf-namespaces'
import BaseThing from "./BaseThing";
import store from "@/store";
import { v4 as uuidv4 } from "uuid";

export default class Space extends BaseThing {
  rdfsClasses = [space.Workspace];
  static defaultCollectionPrefix = "";
  // static nameForSoloThing = 'space'
  static oneThingPerDataset = false;

  static get defaultCollectionUrl() {
    return store.getters["auth/fullFractopiaStorageUrl"] + this.defaultCollectionPrefix
  }
  childClass = Space

  static datasetName = 'spaces'
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
    storagePath: {
      type: 'url',
      rdfType: space.storage
    },
    portalIndex: {
      type: 'url',
      rdfType: solid.TypeIndex
    },
    defaultIndexFolder: {
      type: 'url',
      rdfType: solid.TypeRegistration
    },
    isDefaultSpace: {
      type: 'boolean',
      rdfType: space.masterWorkspace
    }
  }
  constructor({ id, url, name, datasetUrl, description, storagePath, portalIndex, defaultIndexFolder, isDefaultSpace, }) {
    super({ id });
    this.name = name;
    this.description = description;
    this.storagePath = storagePath || store.getters['auth/fullFractopiaStorageUrl'] + uuidv4()
    this.portalIndex = portalIndex;
    this.defaultIndexFolder = defaultIndexFolder;
    this.isDefaultSpace = isDefaultSpace;
    this.solveUrl({ id, url, datasetUrl })
  }

  static async getAllAvailable(returnObject) {
    // if (url) {

    //   let { datasetUrl } = parseFractopiaUrl(url);
    // }
    let dummySpace = new Space({})
    let spacesArray = []
    let spacesObject = {}
    let indexUrl = this.defaultCollectionUrl + this.datasetName
    try {
      let indexDataset = await getSolidDataset(indexUrl)
      let allSpaceThings = getThingAll(indexDataset)
      for (let spaceThing of allSpaceThings) {
        let spaceClass = getUrl(spaceThing, rdf.type)
        if (spaceClass === dummySpace.class) {
          let space = this.fromThing(spaceThing)
          if (space.url && space.storagePath) {
            if (returnObject) {
              spacesObject[space.url] = space
            } else {
              spacesArray.push(space)

            }
          }
        }
      }
      return returnObject ? spacesObject : spacesArray
    } catch (e) {
      console.log('Error fetching spaces dataset (non existent?)', e)
      return []
    }

  }
  // name of the space
  // description
  // storage - that determines which group
  // belongs to person or group
  //
}
