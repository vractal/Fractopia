/* eslint-disable */

// container
// name
// type of data inside (all, music, etc)
//
import { rdfs, ldp, rdf, foaf, schema, solid, owl } from "rdf-namespaces";
// import { schema, rdf, rdfs, solid, foaf } from "rdf-namespaces";
import { v4 as uuidv4 } from "uuid";
import {
  createThing,
  setThing,
  saveSolidDatasetAt,
  getSolidDataset,
  getStringNoLocale,
  addUrl,
  addStringNoLocale,
  getThingAll,
  getUrl,
  setStringNoLocale,

  // addStringNoLocale,
  // addDatetime,
  // addUrl
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import store from "@/store";
import { parseFractopiaUrl } from "@/utils/utils";
import BaseThing from './BaseThing'

export default class HiperFolder extends BaseThing {
  rdfsClasses = [rdf.Bag];

  id = null;
  name = null;
  url = null;
  new = true;
  type = null;
  dataset = null;
  items = [];
  hiperFolders = []

  static defaultCollectionPrefix = "hiperfolders/";
  static nameForSoloThing = 'self'
  childClass = HiperFolder

  static fieldsSchema = {
    ...BaseThing.baseFieldsSchema,
    name: {
      type: "string",
      rdfType: rdfs.label,
    },
  };

  constructor({ name, id, url }) {
    // if id, save to default space storage
    // if url, save to url and set id
    super({ id })
    this.name = name;
    this.new = true
    super.solveUrl({ id, url })
  }


  afterFromThing(thing, dataset) {
    return this.getItemsFromDataset(thing, dataset)
  }
  getItemsFromDataset(thing, dataset) {
    console.log('thingAfter', thing, dataset)

    let items = []
    let folderItemsThings = getThingAll(dataset);
    console.log('thingAfterThing', this.url, folderItemsThings)

    for (let folderItem of folderItemsThings) {

      if (folderItem.url === thing.url) {
        console.log('folderitem', this.url, folderItem)

        // this.name = getStringNoLocale(folderItem, rdfs.label);
      } else {

        let name = getStringNoLocale(folderItem, rdfs.label);
        let type = getUrl(folderItem, rdfs.subClassOf);
        let url = getStringNoLocale(folderItem, schema.relatedLink);
        let newItem = new HiperFolderItem({ name, type, url });

        items.push(newItem);
      }
      console.log('getitems', items)
    }

    this.items = items
    return this
  }

  static async addReferenceToUrl(reference, url) {
    return this.prototype.addReference(reference, url);
  }

  // reference is HiperFolderItem data
  async addReference({ name, url: referenceUrl, type }, url = this.url) {
    let folderDataset = await getSolidDataset(url); // full url

    let folderItemThing = createThing({ name: referenceUrl.replace('#', '') }); // id or url?
    folderItemThing = setStringNoLocale(folderItemThing, rdfs.label, name);
    folderItemThing = addUrl(folderItemThing, rdfs.subClassOf, type);
    folderItemThing = setStringNoLocale(folderItemThing, schema.relatedLink, referenceUrl);

    folderDataset = setThing(folderDataset, folderItemThing);

    return saveSolidDatasetAt(url, folderDataset, {
      fetch: fetch,
    });
  }




}

export class HiperFolderItem {
  url;
  name;
  dataModified;
  type;
  constructor({ url, name, type }) {
    this.url = url;
    this.name = name;
    this.type = type;
  }
}
