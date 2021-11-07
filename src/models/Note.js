/* eslint-disable */
import { schema } from "rdf-namespaces";
import BaseThing from '@/models/BaseThing';

export default class Note extends BaseThing {
    rdfsClasses = [schema.NoteDigitalDocument];

    hiperFolders = [];
    content = null;
    title = null;
    dateCreated = null;
    lastModified = null;


    id = null; // Dataset name (filename inside container)

    static defaultCollectionPrefix = "notes/";
    static nameForSoloThing = 'self'

    static fieldsSchema = {
        ...BaseThing.baseFieldsSchema,
        content: {
            type: 'string',
            rdfType: schema.text,
        },
        dateCreated: {
            type: 'date',
            rdfType: schema.dateCreated,
        },
        lastModified: {
            type: 'date',
            rdfType: schema.dateModified,
        },
        title: {
            type: 'string',
            rdfType: schema.headline,
        },
    };
    childClass = Note

    constructor({ id, title, content, url, datasetUrl }) {
        super({ id });
        this.title = title;
        this.content = content;
        super.solveUrl({ id, url, datasetUrl })
    }




}
