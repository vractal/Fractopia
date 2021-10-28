import { SolidContainerModel } from "soukai-solid";
import { FieldType } from "soukai";
// import { schema } from "rdf-namespaces";
import Note from '@/models/Note'

export default class NoteContainer extends SolidContainerModel {

    rdfContexts = {
        schema: "https://schema.org/",
    };

    fields = {
        name: {
            type: FieldType.String,
            rdfProperty: 'rdfs:label',
        },
    }


    noteRelationship() {
        return this.contains(Note);
    }

}

