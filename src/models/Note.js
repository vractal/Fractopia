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
import { store } from "../store/index";

export default class Note {
  rdfContexts = {
    schema: "https://schema.org/",
  };

  // static collection = "";
  static collectionPath = "public/fractopia/notes/";
  static collectionPodUrl = "https://solidmias.solidweb.org/";
  static defaultCollection =
    "https://solidmias.solidweb.org/public/fractopia/notes/";
  url = null;
  // static get colection() {
  //   return this.collectionPodUrl + this.collectionPath;
  // }
  // static get url() {
  //   return this.colection;
  // }
  rdfsClasses = [schema.NoteDigitalDocument];

  content = null;
  title = null;
  dateCreated = null;
  lastModified = null;
  title = null;
  new = true;

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

  constructor({ title, content } = {}) {
    this.title = title;
    this.content = content;
    this.new = true;
  }

  static fromThing(noteThing) {
    let note = new Note();
    note.content = getStringNoLocale(
      noteThing,
      note.fieldsSchema.content.rdfType
    );
    note.title = getStringNoLocale(noteThing, note.fieldsSchema.title.rdfType);
    note.url = this.url;
    note.collection = this.defaultCollection;
    note.new = false;
  }

  addWithCorrectType(thing, field, value) {
    switch (this.fieldsSchema[field].rdfType) {
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
    let noteDataset;
    let noteThing;
    if (this.new) {
      noteDataset = createSolidDataset();

      noteThing = buildThing(createThing({ name: "note" }))
        .addUrl(rdf.type, this.rdfsClasses[0])
        .build();

      noteDataset = setThing(noteDataset, noteThing);

      for (let field in this.fieldsSchema) {
        console.log("field", field);

        if (this[field]) {
          this.addWithCorrectType(noteThing, field, this.fieldsSchema[field]);
        }
      }
    } else {
      noteDataset = await getSolidDataset(this.url);
      noteThing = getThing(noteDataset, this.url + "#note");
    }

    // for (let field in noteData) {
    //   if (field === null) {
    //     // nada?
    //   } else if (this.fieldsSchema.contains(field)) {
    //     noteThing = this.addWithCorrectType(noteThing, field);
    //   } else {
    //     console.warn("Unknown parameter for Note Class", field);
    //   }
    // }
    console.log("save", this.url);
    await saveSolidDatasetAt(
      this.url,
      noteDataset,
      { fetch: fetch } // fetch from authenticated Session
    );

    return true;
  }

  static async find({ noteId, noteUrl }) {
    console.log("find", this.defaultCollection);
    let url;
    if (noteId) {
      url = this.defaultCollection + noteId;
    } else if (noteUrl) {
      url = noteUrl;
    } else {
      throw new Error("Missing required Parameter");
    }
    console.log("url", url);

    const noteDataset = await getSolidDataset(
      url,
      { fetch: fetch } // fetch from authenticated session
    );
    const noteThing = getThing(noteDataset, url + "#note");

    let newNote = this.fromThing(noteThing);
    return newNote;
  }
}
