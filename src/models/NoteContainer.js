import { SolidContainerModel } from "soukai-solid";
import { FieldType } from "soukai";
import { schema } from "rdf-namespaces";
import Note from '@/models/Note'

export default class NoteContainer extends SolidContainerModel {
    rdfContexts = {
        schema: "https://schema.org/",
    };

    // rdfsClasses = ["rd"];

    fields = {
        content: {
            type: FieldType.String,
            rdfType: schema.text,
        },
        dateCreated: {
            type: FieldType.Date,
            rdfType: schema.dateCreated,
        },
        lastModified: {
            type: FieldType.Date,
            rdfType: schema.dateModified,
        },
        title: {
            type: FieldType.String,
            rdfType: schema.headline,
        },

        notesRelationship() {
            return this.contains(Note);
        }

    };
}
