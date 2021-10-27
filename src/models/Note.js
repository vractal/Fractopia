import SoukaiSolid, { SolidEngine, SolidModel } from "soukai-solid";
import Soukai, { FieldType, MultiModelRelation } from "soukai";
import { schema } from "rdf-namespaces";
export default class Note {
  rdfContexts = {
    schema: "https://schema.org/",
  };

  rdfsClasses = ["schema:NoteDigitalDocument"];

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
      rdfType: schema.lastModified,
    },
    title: {
      type: FieldType.String,
      rdfType: schema.headline,
    },
  };
}
