/* eslint-disable */

// container
// name
// type of data inside (all, music, etc)
//
import { rdfs, ldp, rdf, foaf, schema, solid, owl } from "rdf-namespaces";
// import { schema, rdf, rdfs, solid, foaf } from "rdf-namespaces";
import { v4 as uuidv4 } from "uuid";
import {
  createSolidDataset,
  buildThing,
  createThing,
  setThing,
  saveSolidDatasetAt,
  getSolidDataset,
  getThing,
  getStringNoLocale,
  addUrl,
  addStringNoLocale,
  getStringWithLocaleAll,
  saveSolidDatasetInContainer,
  getThingAll,
  getUrl,
  // addStringNoLocale,
  // addDatetime,
  // addUrl
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import store from "@/store";
import { parseFractopiaUrl } from "@/utils/utils";

export default class HiperFolder {
  rdfsClasses = [rdf.Bag];

  id = null;
  name = null;
  url = null;
  new = false;
  type = null;
  dataset = null;
  items = [];
  defaultPath = "hiperfolders/";
  fieldsSchema = {
    name: {
      type: "string",
      rdfType: rdfs.label,
    },
    // items: {
    //   // range?
    //   type: "string",
    //   rdfType: ldp.isMemberOfRelation,
    // },

    getItems() {
      // const
      // get dataset
      // getThingAll
      // transformar em 2outra coisa?
      // return things
    },
  };

  constructor({ name, id, url }) {
    // if id, save to default space storage
    // if url, save to url and set id
    this.id = id;
    this.name = name;
    this.url = url;
    this.new = true;
  }

  static fromDataset(dataset) {
    let hiperFolder = new HiperFolder({});
    // 2;    console.log("dataset", hiperFolder);
    console.log("dataset", dataset);
    let url = dataset.internal_resourceInfo.sourceIri;
    let folderSelfThing = getThing(dataset, url + "#self");
    console.log(`hiper`, dataset, url, hiperFolder);
    hiperFolder.name = getStringNoLocale(
      folderSelfThing,
      hiperFolder.fieldsSchema.name.rdfType
    );
    // note.title = getStringNoLocale(
    //   noteThing,
    //   note.fieldsSchema.title.rdfType
    // );
    hiperFolder.url = url.replace("#self", ""); // not reliable
    hiperFolder.new = false;

    return hiperFolder;
  }

  static async addReferenceToUrl(reference, url) {
    return this.prototype.addReference(reference, url);
  }
  // reference is HiperFolderItem data
  async addReference({ name, url: referenceUrl, type }, url) {
    let folderDataset = await getSolidDataset(url); // full url
    console.log("addReference", folderDataset, url);

    let folderItemThing = createThing({ name: referenceUrl }); // id or url?
    folderItemThing = addStringNoLocale(folderItemThing, rdfs.label, name);
    folderItemThing = addUrl(folderItemThing, rdfs.subClassOf, type);
    folderDataset = setThing(folderDataset, folderItemThing);
    return saveSolidDatasetAt(url, folderDataset, {
      fetch: fetch,
    });
  }

  // async addSubfolder(hiperFolder, url = this.url) {
  //   addReference
  // }
  addWithCorrectType(thing, field, value) {
    switch (this.fieldsSchema[field].rdfType) {
      case rdfs.label:
        return addStringNoLocale(
          thing,
          this.fieldsSchema[field].rdfType,
          value
        );
      case schema.headline:
        return addStringNoLocale(
          thing,
          this.fieldsSchema[field].rdfType,
          value
        );
      default:
        return thing;
    }
  }

  async save() {
    // folderDataset = await getSolidDataset(this.fullDatasetPath);
    console.log("save", this, this.url);
    let folderDataset;
    let folderThing;
    if (this.new) {
      // Create
      folderDataset = createSolidDataset();
      folderThing = createThing({ name: "self" });

      folderThing = addUrl(folderThing, rdf.type, this.rdfsClasses[0]);
      for (let field in this.fieldsSchema) {
        if (this[field]) {
          folderThing = this.addWithCorrectType(
            folderThing,
            field,
            this[field]
          );
        }
      }
      console.log("folderThig", folderThing);

      folderDataset = setThing(folderDataset, folderThing);
      try {
        await saveSolidDatasetAt(
          this.url,
          folderDataset,
          { fetch: fetch } // fetch from authenticated Session
        );
        this.new = false;

        return true;
      } catch (e) {
        console.log("Error saving solidDataset at", this.url, e?.message);
        return false;
      }
      // }
      // else {
      //   // Update
      //   folderDataset = await getSolidDataset(this.url);
      //   folderThing = getThing(noteDataset, this.url + "#self");
      //   for (let field in this.fieldsSchema) {
      //     if (field === null) {
      //       // nada?
      //     } else if (this.fieldsSchema.contains(field)) {
      //       folderThing = this.addWithCorrectType(folderThing, field);
      //     } else {
      //       console.warn("Unknown parameter for Note Class", field);
      //     }
      //   }
      // }

      // try {
      //   await saveSolidDatasetAt(
      //     this.url,
      //     folderDataset,
      //     { fetch: fetch } // fetch from authenticated Session
      //   );
      //   this.new = false;

      //   return true;
      // } catch (e) {
      //   console.log("Error saving solidDataset at", this.url, e?.message);
      //   return false;
      // }
    }
  }
  static async find(url) {
    var { fullUrl } = parseFractopiaUrl(url);

    try {
      const hiperFolderDataset = await getSolidDataset(
        fullUrl,
        { fetch: fetch } // fetch from authenticated session
      );

      let hiperFolder = this.fromDataset(hiperFolderDataset);
      let folderItems = getThingAll(hiperFolderDataset);
      for (let folderItem of folderItems) {
        if (folderItem.url === fullUrl + "#self") {
          hiperFolder.name = getStringNoLocale(folderItem, rdfs.label);
        } else {
          let name = getStringNoLocale(folderItem, rdfs.label);
          let type = getUrl(folderItem, rdfs.subClassOf);
          let url = folderItem.url.replace(fullUrl + "#", "");
          let newItem = new HiperFolderItem({ name, type, url });

          hiperFolder.items.push(newItem);
        }
      }
      console.log("folderItems", folderItems);
      return hiperFolder;
    } catch (e) {
      console.log("Thing not found", e);
      return false;
    }
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
