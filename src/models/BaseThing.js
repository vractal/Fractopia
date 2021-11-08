/* eslint-disable */
import { schema, rdf } from "rdf-namespaces";
import { v4 as uuidv4 } from "uuid";
import {
  createSolidDataset,
  createThing,
  setThing,
  saveSolidDatasetAt,
  getSolidDataset,
  getThing,
  getStringNoLocale,
  addUrl,
  setStringNoLocale,
  getUrlAll,
  getStringNoLocaleAll,
  addStringNoLocale,
  // addStringNoLocale,
  // addDatetime,
  // addUrl
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import store from "@/store";
import { parseFractopiaUrl } from '@/utils/utils'
import { addReferenceToFolderUrl } from "@/utils/solid";


export default class BaseThing {
  // definition of rdfClass used by notes
  // for now, uses first element of list [0]
  rdfsClasses = [schema.Thing];


  id = null; // Dataset name (filename inside container)
  url = null;
  thing = null;
  hiperFolders = []
  new = true;
  // dateCreated = null;
  // lastModified = null;

  //  Probably you will want to change that in subclasses
  static defaultCollectionPrefix = 'things/'
  static oneThingPerDataset = true;
  static nameForSoloThing = 'self'

  childClass = BaseThing

  get thingName() {
    return this.childClass.oneThingPerDataset ? this.childClass.nameForSoloThing : this.id
  }

  static get defaultCollectionUrl() {
    return store.getters["auth/fullSpaceUrl"] + this.defaultCollectionPrefix
  }

  static baseFieldsSchema = {
    // dateCreated: {
    //   type: Date,
    //   rdfType: schema.dateCreated,
    // },
    // lastModified: {
    //   type: Date,
    //   rdfType: schema.dateModified,
    // },
    hiperFolders: { type: 'folderRelation', rdfType: schema.isRelatedTo },

  };

  constructor({ id }) {
    this.new = true;
    this.id = id || uuidv4();
  }

  solveUrl({ url, id, datasetUrl }) {
    let normalizedId = id || this.id || uuidv4()
    if (url === undefined || url === null) {

      if (this.childClass.oneThingPerDataset) {
        if (datasetUrl) {
          this.url = datasetUrl + normalizedId
        } else {
          this.url = `${this.childClass.defaultCollectionUrl}${normalizedId}#${this.childClass.nameForSoloThing}`
        }
      } else {
        this.url = `${this.childClass.defaultCollectionUrl}${uuidv4()}#${normalizedId}`
      }
    } else {
      this.url = url;
    }
  }

  static fromThing(thing, dataset) {
    // let ThingClass = this
    let Class = this
    let thingModel = new Class({})

    thingModel.url = thing.url
    thingModel.new = false;

    // get field values
    for (let field in this.fieldsSchema) {

      thingModel[field] = thingModel.childClass.getWithCorrectType(thing, field)
    }
    thingModel = thingModel.afterFromThing(thing, dataset)
    return thingModel;
  }
  // eslint-disable-next-line 
  afterFromThing(thing, dataset) {
    return this
  }

  // parses types to correct solid-client function
  static getWithCorrectType(thing, field) {
    switch (this.fieldsSchema[field]?.type) {
      case 'string':
        return getStringNoLocale(
          thing,
          this.fieldsSchema[field].rdfType
        );
      case 'folderRelation':
        return getUrlAll(
          thing,
          this.fieldsSchema[field].rdfType

        );
      case 'array-string':
        return getStringNoLocaleAll(
          thing,
          this.fieldsSchema[field].rdfType,
        )
    }
  }


  // parses types to correct solid-client function
  static addWithCorrectType(thing, field, value) {
    console.log('add', thing, field, value, this.fieldsSchema[field]?.rdfType)

    switch (this.fieldsSchema[field]?.type) {
      case 'string':
        return setStringNoLocale(
          thing,
          this.fieldsSchema[field].rdfType,
          value
        );
      case 'array-string':
        var newThing = thing
        if (!Array.isArray(value)) {
          return thing
        }
        for (let itemValue in value) {
          newThing = addStringNoLocale(
            thing,
            this.fieldsSchema[field].rdfType,
            value[itemValue].toString()
          );
        }

        console.log('Array', value, value, newThing)

        return newThing;
      default:
        return thing
    }
  }


  // save thing
  async save() {
    // dadas as variáveis, salva em um arquivo as informações do portal no dataset
    // save portal information on a file in the dataset
    // create portalIndex
    // add reference to portal in portalIndex
    let dataset;
    let url;
    let { fullUrl, datasetUrl } = parseFractopiaUrl(this.url, this.childClass.defaultCollectionPrefix);
    console.log('initialSetup4', this, datasetUrl, fullUrl)

    // check if it's a new thing
    if (this.new) {
      // Create
      dataset = createSolidDataset();
      this.thing = createThing({ name: this.thingName })

      this.thing = addUrl(this.thing, rdf.type, this.rdfsClasses[0])
    } else {
      // Update

      dataset = await getSolidDataset(datasetUrl);
      this.thing = getThing(dataset, fullUrl);

    }
    console.log('initialSetup5', this, fullUrl)
    let childClass = this.childClass
    // add field values
    for (let field in childClass.fieldsSchema) {
      if (this.hasOwnProperty(field) && this[field] !== null) {

        this.thing = childClass.addWithCorrectType(this.thing, field, this[field])
      } else {
        console.warn("Unknown parameter for thing Class", field);
      }
    }
    this.updateContainerBackReferences()
    dataset = setThing(dataset, this.thing);

    try {
      await saveSolidDatasetAt(
        datasetUrl,
        dataset,
        { fetch: fetch } // fetch from authenticated Session
      );
      this.new = false;
      await this.updateContainerReferences()

      return this;
    } catch (e) {
      console.log(
        "Error saving solidDataset at",
        datasetUrl,
        e?.message
      );
      return false;
    }


  }

  // references are stored on thingContainer
  // when it's changed, changes data in all related places

  // changes on the thing itself:
  // 1. store isReferencedBy on the thing itself
  updateContainerBackReferences() {
    if (!this.thing) {
      console.warn("No thing provided when adding reference")
    }

    // relations between note and folders where it's referenced
    let allFolderUrls = getUrlAll(
      this.thing,
      this.childClass.fieldsSchema["hiperFolders"].rdfType
    );

    // add not yet saved backlinks (to hiperfolders)
    for (let url of this.hiperFolders) {
      if (!allFolderUrls.includes(url)) {
        this.thing = addUrl(this.thing, this.childClass.fieldsSchema["hiperFolders"].rdfType, url)
      }
      // TODO: Remove backlinks
    }
  }

  // changes to references of the thing:
  // write/update references inside hiperfolders 
  // Maybe should detached for performance (also append)
  async updateContainerReferences() {
    let label = this[this.fieldForLabel] || this.name || this.title || ""
    console.log('UpdateReferences', this.url, this)
    for (let folderUrl of this.hiperFolders) {
      try {
        await addReferenceToFolderUrl(
          {
            name: label,
            url: this.url,
            type: this.rdfsClasses[0],
          },
          folderUrl
        );
      } catch (error) {
        console.warn("Failed saving container reference", folderUrl, this.url, error);
      }
    }
  }


  static async find(url) {
    let thingUrl;
    let { fullUrl, datasetUrl, datasetName, id: urlId } = parseFractopiaUrl(url, this.defaultCollectionPrefix);

    if (!urlId) {
      if (this.oneThingPerDataset) {
        thingUrl = datasetUrl + '#' + this.nameForSoloThing;
      }
    } else {
      thingUrl = fullUrl
    }

    try {
      console.log('dataset', datasetUrl)
      const modelDataset = await getSolidDataset(
        datasetUrl,
        { fetch: fetch } // fetch from authenticated session
      );
      const modelThing = getThing(modelDataset, thingUrl);

      let newModel = this.fromThing(modelThing, modelDataset);
      console.log('Find?', newModel)
      return newModel;
    } catch (error) {
      console.warn("Thing not found with Url provided", this, thingUrl, error)
      return false
    }

  }



  addFolder(folderId) {
    this.hiperFolders.push(folderId);
  }
}