
import { schema, rdf } from "rdf-namespaces"
import { v4 as uuidv4 } from 'uuid';
import {
  createSolidDataset,
  buildThing,
  createThing,
  setThing,
  saveSolidDatasetAt,
  getSolidDataset,
  getThing,
  getStringNoLocale
  // addStringNoLocale,
  // addDatetime,
  // addUrl
} from '@inrupt/solid-client'
import { fetch } from '@inrupt/solid-client-authn-browser'


export default class Note {

  rdfContexts = {
    schema: "https://schema.org/",
  };

  static collection = "https://zesolid.solidcommunity.net/public/tmp/notes/";

  url = null

  static rdfsClasses = [schema.NoteDigitalDocument];

  content = null
  title = null

  static fieldsSchema = {
    content: {
      type: String,
      rdfType: schema.text,
    },
    name: {
      type: String,
      rdfType: schema.name
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
    }
  }

  static async save({ content, title, id, noteUrl }) {
    let noteDataset = createSolidDataset();
    const newNoteThing = buildThing(createThing({ name: "note" }))
      .addUrl(rdf.type, this.rdfsClasses[0])
      .addStringNoLocale(this.fieldsSchema.content.rdfType, content)
      .addStringNoLocale(this.fieldsSchema.title.rdfType, title)
      .build();
    noteDataset = setThing(noteDataset, newNoteThing);
    let finalUrl;
    if (id) {
      finalUrl = this.collection + id
    } else if (noteUrl) {
      finalUrl = noteUrl
    } else {
      finalUrl = this.collection + uuidv4()
    }
    await saveSolidDatasetAt(
      finalUrl,
      noteDataset,
      { fetch: fetch }             // fetch from authenticated Session
    );

    let note = new Note()
    note.content = content
    note.title = title
    return note
    // create dataset
    // create things
    // thing dentro do dataset
    // retorna nova thing

  }

  static async find({ noteId, noteUrl }) {
    if (noteId) {
      this.url = this.collection + noteId
    } else if (noteUrl) {
      this.url = noteUrl
    } else {
      throw new Error("Missing required Parameter")
    }

    const noteDataset = await getSolidDataset(
      this.url,
      { fetch: fetch }          // fetch from authenticated session
    );
    const noteThing = getThing(
      noteDataset,
      this.url + "#note"
    );
    let newNote = new Note()
    newNote.content = getStringNoLocale(noteThing, this.fieldsSchema.content.rdfType)
    newNote.title = getStringNoLocale(noteThing, this.fieldsSchema.title.rdfType)
    newNote.url = this.url
    console.log('newNote', newNote)
    return newNote

  }


}

