/* eslint-disable */
import { schema } from "rdf-namespaces";
import BaseThing from '@/models/BaseThing';
import HiperFolder from "./HiperFolder";

export default class Note extends BaseThing {
    rdfsClasses = [schema.NoteDigitalDocument];

    hiperFolders = [];
    content = null;
    title = null;



    id = null; // Dataset name (filename inside container)

    static defaultCollectionPrefix = "notes/";
    static nameForSoloThing = 'self'

    static fieldsSchema = {
        ...BaseThing.baseFieldsSchema,
        content: {
            type: 'string',
            rdfType: schema.text,
        },

        title: {
            type: 'string',
            rdfType: schema.headline,
        },
    };
    childClass = Note
    static ContainerClass = HiperFolder

    constructor({ id, title, content, url, datasetUrl }) {
        super({ id });
        this.title = title;
        this.content = content;
        this.solveUrl({ id, url, datasetUrl })
    }




}
