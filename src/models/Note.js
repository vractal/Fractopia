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

  static defaultCollectionPath = "notes/";
  customCollectionPath = null;

  get collectionPath() {
    return this.customCollectionPath || Note.defaultCollectionPath;
  }

  get currentSpacePath() {
    return store.state.auth.storage + store.state.auth.spaceStorage
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

  constructor({ id, title, content, noteUrl }) {
    this.title = title;
    this.content = content;
    this.new = true;
    if (noteUrl === undefined || noteUrl === null) {
      this.id = id || uuidv4();
    } else {
      this.url = noteUrl

    }

    console.log("this.id", id, noteUrl);
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
    return note;
  }

  addWithCorrectType(thing, field, value) {

    switch (this.fieldsSchema[field].rdfType) {
      case schema.text:
        console.log('Case', schema.text)
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
    console.log('SAVE:')

    let noteDataset;
    let noteThing;
    let url = this.fullDatasetPath;
    if (this.new) {
      // Create
      noteDataset = createSolidDataset();
      noteThing = createThing({ name: "note" })

      noteThing = addUrl(noteThing, rdf.type, this.rdfsClasses[0])


      for (let field in this.fieldsSchema) {
        if (this[field]) {
          noteThing = this.addWithCorrectType(noteThing, field, this[field]);
        }
      }
      noteDataset = setThing(noteDataset, noteThing);


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

    console.log('SAVE:', noteThing, this.fullDatasetPath)

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
      Note.prototype.fullCollectionPath + url;
    console.log("Thing", finalUrl, url);


    try {
      const noteDataset = await getSolidDataset(
        finalUrl,
        { fetch: fetch } // fetch from authenticated session
      );
      const noteThing = getThing(noteDataset, finalUrl + "#note");
      let newNote = this.fromThing(noteThing);
      return newNote;

    } catch (e) {
      console.log("Thing not found", e)
      return false;

    }

  }
}

// Find

    // if (noteId) {
    //   url = this.defaultCollection + noteId;
    // } else if (noteUrl) {
    //   url = noteUrl;
    // } else {
    //   throw new Error("Missing required Parameter");
    // }