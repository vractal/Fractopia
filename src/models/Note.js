export default class Note {
  type = "urlfornotevocabulary";
  fields = {
    content: {
      type: String,
      rdfType: "urlforcontent",
    },
    dateCreated: {
      type: Date,
      rdfType: "urlfordatecreated",
    },
    lastModified: {
      type: Date,
      rdfType: "urlforlastmodified",
    },
    title: {
      type: String,
      rdfType: "urlfortitle",
    },
  };
}
