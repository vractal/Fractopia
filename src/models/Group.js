/* eslint-disable */
import { foaf, rdfs, schema } from "rdf-namespaces";
import BaseThing from '@/models/BaseThing';

export default class Group extends BaseThing {
    rdfsClasses = [schema.NoteDigitalDocument];

    hiperFolders = [];
    name = null;



    id = null; // Dataset name (filename inside container)

    static defaultCollectionPrefix = "groups/";
    static nameForSoloThing = 'self'

    static fieldsSchema = {
        ...BaseThing.baseFieldsSchema,
        name: {
            type: 'string',
            rdfType: rdfs.label,
        },
        description: {
            type: 'string',
            rdfType: schema.text,
        },
        members: {
            type: 'relation',
            rdfType: foaf.member
        }

    };
    childClass = Note

    constructor({ id, title, content, url, datasetUrl }) {
        super({ id });
        this.title = title;
        this.content = content;
        super.solveUrl({ id, url, datasetUrl })
    }




}
