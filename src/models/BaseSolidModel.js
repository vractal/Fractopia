/* eslint-disable */
import { schema, rdf } from "rdf-namespaces";
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
  // addStringNoLocale,
  // addDatetime,
  // addUrl
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import store from "@/store";

export default class BaseSolidModel {
  rdfContexts = {
    schema: "https://schema.org/",
  };

  // static collection = "";
  static collectionPath = "public/fractopia/notes/";

  // static get colection() {
  //   return this.collectionPodUrl + this.collectionPath;
  // }
  // static get url() {
  //   return this.colection;
  // }
  rdfsClasses = [schema.Thing];

  content = null;
  title = null;
  a;
  dateCreated = null;
  lastModified = null;
  title = null;
  new = true;

  id = null; // Dataset name (filename inside container)

  get currentWebId() {
    return store.state.auth.webId?.replace("profile/card#me", "");
  }
  static defaultCollectionPath = "public/fractopia/notes/";
  customCollectionPath = "public/fractopia/notes/";

  get collectionPath() {
    return this.customCollectionPath || Note.defaultCollectionPath;
  }

  get currentSpacePath() {
    return "";
  }

  get fullCollectionPath() {
    return this.currentWebId + this.currentSpacePath + this.collectionPath;
  }

  get fullDatasetPath() {
    return this.id ? this.fullCollectionPath + this.id : this.url;
  }
  url = null;

  fieldsSchema = {
    content: {
      type: String,
      rdfType: schema.text,
    },
    dateCreated: {
      type: Date,
      rdfType: schema.dateCreated,
    },
    lastModified: {
      type: Date,
      rdfType: schema.dateModified,
    },
    title: {
      type: String,
      rdfType: schema.headline,
    },
  };

  constructor({ id, title, content }) {
    this.title = title;
    this.content = content;
    this.new = true;
    this.id = id;
    console.log("this.id", id);
  }

  static fromThing(modelThing) {
    let model = new this.constructor(modelThing);
    ({});
    note.content = getStringNoLocale(
      modelThing,
      note.fieldsSchema.content.rdfType
    );
    note.title = getStringNoLocale(modelThing, note.fieldsSchema.title.rdfType);
    note.url = modelThing.url.replace("#note", ""); // not reliable

    note.collection = this.defaultCollection;
    note.new = false;
  }

  getWithCorrectType() {}

  addWithCorrectType(thing, field, value) {
    switch (this.fieldsSchema[field]?.rdfType) {
      case schema.text:
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
    }
  }
  async save() {
    let modelDataset;
    let modelThing;
    let url = this.fullDatasetPath;
    if (this.new) {
      // Create
      modelDataset = createSolidDataset();
      modelThing = buildThing(createThing({ name: "note" }))
        .addUrl(rdf.type, this.rdfsClasses[0])
        .build();

      modelDataset = setThing(modelDataset, modelThing);

      for (let field in this.fieldsSchema) {
        if (this[field]) {
          this.addWithCorrectType(modelThing, field, this.fieldsSchema[field]);
        }
      }
    } else {
      // Update
      modelDataset = await getSolidDataset(this.fullDatasetPath);
      modelThing = getThing(modelDataset, this.fullDatasetPath + "#note");
      for (let field in noteData) {
        if (field === null) {
          // nada?
        } else if (this.fieldsSchema.contains(field)) {
          modelThing = this.addWithCorrectType(modelThing, field);
        } else {
          console.warn("Unknown parameter for Note Class", field);
        }
      }
    }

    try {
      await saveSolidDatasetAt(
        this.fullDatasetPath,
        modelDataset,
        { fetch: fetch } // fetch from authenticated Session
      );
      this.new = false;

      return true;
    } catch (e) {
      console.log(
        "Error saving solidDataset at",
        this.fullDatasetPath,
        e?.message
      );
      return false;
    }
  }

  create() {}

  static async find({ url }) {
    let finalUrl =
      BaseSolidModel.prototype.currentWebId +
      BaseSolidModel.defaultCollectionPath +
      url;
    // if (noteId) {
    //   url = this.defaultCollection + noteId;
    // } else if (noteUrl) {
    //   url = noteUrl;
    // } else {
    //   throw new Error("Missing required Parameter");
    // }

    const modelDataset = await getSolidDataset(
      finalUrl,
      { fetch: fetch } // fetch from authenticated session
    );
    const modelThing = getThing(noteDataset, finalUrl + "#note");

    let newModel = this.fromThing(modelThing);
    return newModel;
  }
}
