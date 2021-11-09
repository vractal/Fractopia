import store from "@/store";
import { rdf } from "rdf-namespaces";

import { includes } from "lodash";

// parses URLs to get datasetUrl and id of things
// also checks if the URL is a valid one
const parseFractopiaUrl = (url = "") => {
  let parsed = { fullUrl: url }

  if (!(includes(url, "http://") || includes(url, "https://"))) {
    console.warn("Weird url when parsing (no schema)", url)
    return { parsed: false }
  }

  const podUrl = store.getters["auth/podUrl"];

  if (includes(url, podUrl)) {
    parsed.isFromUserPod = true
  }

  let splitByHashUrl = url.split('#')
  parsed.datasetUrl = splitByHashUrl[0]

  if (splitByHashUrl.length === 2) {
    parsed.id = splitByHashUrl[1]
  } else if (splitByHashUrl.length > 2) {
    console.warn("Weird  Url when parsing ('#' > 1)", url)
  } else {
    console.warn("Incomplete url when parsing (no #<id>)", url)
  }

  let splitBySlashUrl = splitByHashUrl[0].split('/')
  parsed.datasetName = splitBySlashUrl[splitBySlashUrl.length - 1]


  return parsed
};

const putEndSlash = (url) => {

  return (url?.length > 1) && (url[url.length - 1] !== '/') ? url + '/' : url
}

const getPodUrlFromWebId = (webId) => {
  return webId?.replace("profile/card#me", "");
};

const parseFolderItemType = (file) => {
  switch (file.type) {
    case rdf.Bag:
      return {
        name: file.name,
        type: file.type,
        url: file.url,
        children: []
      };

    default:
      return {
        name: file.name,
        type: file.type,
        url: file.url,
        file: "md"
      };
  }
}



export { parseFractopiaUrl, getPodUrlFromWebId, parseFolderItemType, putEndSlash };
