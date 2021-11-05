import store from "@/store";
import { includes } from "lodash";
const parseFractopiaUrl = (url = "", dataNamespace = "") => {
  //   const userPodUrl = getPodUrlFromWebId(store.state.auth.webId);
  const { fractopiaStoragePrefix } = store.state.auth;
  const fullSpaceUrl = store.getters["auth/fullSpaceUrl"];
  console.log("parseUrl", url);
  let parsed = {};
  if (includes(url, "http://") || includes(url, "https://")) {
    // is this check enough?
    parsed.fullUrl = url;
    if (includes(url, fractopiaStoragePrefix)) parsed.isFractopiaUrl = true;
    if (includes(url, fullSpaceUrl)) {
      parsed.isSameSpace = true;
      parsed.datasetId = url.replace(fullSpaceUrl);
    }
  } else if (!includes(url, fractopiaStoragePrefix)) {
    // is justId
    parsed.fullUrl = fullSpaceUrl + dataNamespace + url;
    parsed.datasetId = url;
    parsed.isSpaceGuessed = true;
    console.warn("Guessing url is not recommended", parsed);
  }

  return parsed;
};

const getPodUrlFromWebId = (webId) => {
  return webId?.replace("profile/card#me", "");
};

export { parseFractopiaUrl, getPodUrlFromWebId };
