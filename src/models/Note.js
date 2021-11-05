/* eslint-disable */
import { schema, rdf, rdfs, solid, foaf } from "rdf-namespaces";
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
  getStringNoLocaleAll,
  getUrlAll,
  addLiteral,
  setStringNoLocale,
  // addStringNoLocale,
  // addDatetime,
  // addUrl
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import store from "@/store";
import HiperFolder from "./HiperFolder";
import { parseFractopiaUrl } from "@/utils/utils";

export default class Note {

  // rdfContexts = {
  //   schema: "https://schema.org/",
  // };

  // static collection = "";

  // static get colection() {
  //   return this.collectionPodUrl + this.collectionPath;
  // }
  // static get url() {
  //   return this.colection;
  // }

  // definition of rdfClass used by notes
  // for now, uses first element of list [0]
  rdfsClasses = [schema.NoteDigitalDocument];
  hiperFolders = [];
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

  static defaultCollectionPrefix = "notes/";
  customCollectionPath = null;

  get collectionPath() {
    return this.customCollectionPath || Note.defaultCollectionPrefix;
  }

  get currentSpacePath() {
    return store.state.auth.storage + store.state.auth.spaceStorage;
  }

  get fullCollectionPath() {
    return this.currentWebId + this.currentSpacePath + this.collectionPath;
  }

  get fullDatasetPath() {
    // if it has url, uses it
    // otherwise, creates a new one
    return this.url ? this.url : this.fullCollectionPath + this.id;
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
    isContainedBy: { type: "string", rdfType: schema.isRelatedTo },
  };

  constructor({ id, title, content, url }) {
    this.title = title;
    this.content = content;
    this.new = true;
    if (url === undefined || url === null) {
      this.id = id || uuidv4();
      this.url =
        store.getters["auth/fullSpaceUrl"] + Note.defaultCollectionPrefix + this.id;
    } else {
      this.url = url;
    }
  }

  static fromThing(noteThing) {
    let note = new Note({});
    note.content = getStringNoLocale(
      noteThing,
      note.fieldsSchema.content.rdfType
    );
    note.title = getStringNoLocale(noteThing, note.fieldsSchema.title.rdfType);
    note.hiperFolders = getUrlAll(noteThing, schema.isRelatedTo);
    console.log('notefromting', note)
    note.url = noteThing.url.replace("#note", ""); // not reliable
    note.collection = this.defaultCollection;
    note.new = false;
    return note;
  }

  addWithCorrectType(thing, field, value) {
    switch (this.fieldsSchema[field].rdfType) {
      case schema.text:
        return setStringNoLocale(
          thing,
          this.fieldsSchema[field].rdfType,
          value
        );
      case schema.headline:
        return setStringNoLocale(
          thing,
          this.fieldsSchema[field].rdfType,
          value
        );
      default:
        return thing
    }
  }
  async save() {
    let noteDataset;
    let noteThing;
    let url = this.url;
    if (this.new) {
      // Create
      noteDataset = createSolidDataset();
      noteThing = createThing({ name: "note" });

      noteThing = addUrl(noteThing, rdf.type, this.rdfsClasses[0]);

      for (let field in this.fieldsSchema) {
        if (this[field]) {
          noteThing = this.addWithCorrectType(noteThing, field, this[field]);
        }
      }
    } else {
      // Update
      noteDataset = await getSolidDataset(this.fullDatasetPath);
      noteThing = getThing(noteDataset, this.fullDatasetPath + "#note");
      for (let field in this.fieldsSchema) {
        if (this[field]) {
          noteThing = this.addWithCorrectType(noteThing, field, this[field]);
        } else {
          console.warn("Unknown parameter for Note Class", field);
        }
      }
    }

    let allFolderUrls = getUrlAll(
      noteThing,
      this.fieldsSchema["isContainedBy"].rdfType
    );

    for (let url of this.hiperFolders) {
      if (!allFolderUrls.includes(url)) {
        noteThing = addUrl(noteThing, this.fieldsSchema["isContainedBy"].rdfType, url)
        allFolderUrls.push(url)
      }
    }
    // add note to dataset
    noteDataset = setThing(noteDataset, noteThing);


    // maybe this should be in another action for performance
    // also should be append
    for (let folderUrl of allFolderUrls) {
      console.log("foldersAll", folderUrl, allFolderUrls);
      try {
        await HiperFolder.addReferenceToUrl(
          {
            name: this.title,
            url: this.fullDatasetPath,
            type: this.rdfsClasses[0],
          },
          folderUrl
        );
      } catch (error) {
        console.warn("Failed saving container reference", error);
      }
    }

    try {
      await saveSolidDatasetAt(
        this.fullDatasetPath,
        noteDataset,
        { fetch: fetch } // fetch from authenticated Session
      );
      this.new = false;

      return this;
    } catch (e) {
      console.log(
        "Error saving solidDataset at",
        this.fullDatasetPath,
        e?.message
      );
      return false;
    }
  }

  static async find(url) {
    let { fullUrl } = parseFractopiaUrl(url, this.defaultCollectionPrefix);

    console.log('fullURL: ', fullUrl)
    try {
      const noteDataset = await getSolidDataset(
        fullUrl,
        { fetch: fetch } // fetch from authenticated session
      );
      const noteThing = getThing(noteDataset, fullUrl + "#note");
      let newNote = this.fromThing(noteThing);
      return newNote;
    } catch (e) {
      console.log("Thing error", fullUrl);
      console.log("Thing not found", e);
      return false;
    }
  }

  addFolder(folderId) {
    this.hiperFolders.push(folderId);
  }
}
