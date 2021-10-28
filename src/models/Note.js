import { SolidModel } from "soukai-solid";
import { FieldType, } from "soukai";
// import { schema } from "rdf-namespaces";
import NoteContainer from  './NoteContainer'

export default class Note extends SolidModel {
  rdfContexts = {
    schema: "https://schema.org/",
  };

  rdfsClasses = ["schema:NoteDigitalDocument"];

  fields = {
    content: {
      type: FieldType.String,
      rdfType: 'schema.text',
    },
    // name: FieldType.String,
            
    // dateCreated: {
    //   type: FieldType.Date,
    //   rdfType: 'schema.dateCreated',
    // },
    // lastModified: {
    //   type: FieldType.Date,
    //   rdfType: 'schema.dateModified',
    // },
    // title: {
    //   type: FieldType.String,
    //   rdfType: 'schema.headline',
    // },
    noteContainerRelationship() {
        return this.isContainedBy(NoteContainer);
    }

  };
}
