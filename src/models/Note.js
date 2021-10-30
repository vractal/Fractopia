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

export default class Note {
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
  rdfsClasses = [schema.NoteDigitalDocument];

  content = null;
  title = null;
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

  static fromThing(noteThing) {
    console.log("noteThing", noteThing);
    let note = new Note({});
    note.content = getStringNoLocale(
      noteThing,
      note.fieldsSchema.content.rdfType
    );
    note.title = getStringNoLocale(noteThing, note.fieldsSchema.title.rdfType);
    note.url = noteThing.url.replace("#note", ""); // not reliable
    console.log("noteThing", note);

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
    let url = this.fullDatasetPath;
    if (this.new) {
      // Create
      noteDataset = createSolidDataset();
      noteThing = buildThing(createThing({ name: "note" }))
        .addUrl(rdf.type, this.rdfsClasses[0])
        .build();

      noteDataset = setThing(noteDataset, noteThing);

      for (let field in this.fieldsSchema) {
        if (this[field]) {
          this.addWithCorrectType(noteThing, field, this.fieldsSchema[field]);
        }
      }
    } else {
      // Update
      noteDataset = await getSolidDataset(this.fullDatasetPath);
      noteThing = getThing(noteDataset, this.fullDatasetPath + "#note");
      for (let field in noteData) {
        if (field === null) {
          // nada?
        } else if (this.fieldsSchema.contains(field)) {
          noteThing = this.addWithCorrectType(noteThing, field);
        } else {
          console.warn("Unknown parameter for Note Class", field);
        }
      }
    }

    try {
      await saveSolidDatasetAt(
        this.fullDatasetPath,
        noteDataset,
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

  static async find({ url }) {
    let finalUrl =
      Note.prototype.currentWebId + Note.defaultCollectionPath + url;
    // if (noteId) {
    //   url = this.defaultCollection + noteId;
    // } else if (noteUrl) {
    //   url = noteUrl;
    // } else {
    //   throw new Error("Missing required Parameter");
    // }

    const noteDataset = await getSolidDataset(
      finalUrl,
      { fetch: fetch } // fetch from authenticated session
    );
    const noteThing = getThing(noteDataset, finalUrl + "#note");

    let newNote = this.fromThing(noteThing);
    return newNote;
  }
}
