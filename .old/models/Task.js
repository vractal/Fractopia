import { rdfs, schema } from "rdf-namespaces";

export default class Task {
  //   rdfContexts = {
  //     lifecycle: "http://purl.org/vocab/lifecycle/schema#",
  //     cal: "http://www.w3.org/2002/12/cal/ical#",
  //   };
  constructor() {
    this.class = "http://purl.org/vocab/lifecycle/schema#";
    this.fields = {
      name: {
        type: String,
        rdfProperty: rdfs.label,
      },
      dateCreated: {
        type: Date,
        rdfProperty: schema.dateCreated,
      },
    };
  }
}
