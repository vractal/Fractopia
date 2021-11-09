// eslint-disable-file
import {
  handleIncomingRedirect,
  login,
  logout,
  // fetch,
  getDefaultSession,
} from "@inrupt/solid-client-authn-browser";
import { getPodUrlFromWebId } from "@/utils/utils";
// initial state
const state = () => ({
  webId: null,
  sessionId: null,
  processing: false,
  processingSilent: false,
  processingStatus: null,
  fractopiaStoragePrefix: "public/Fractopia/v0.15/",
  spaceStoragePrefix: "pessoal/",
});

// getters
const getters = {
  podUrl(state) {
    return getPodUrlFromWebId(state.webId);
  },
  fullFractopiaStorageUrl(state) {
    return getPodUrlFromWebId(state.webId) + state.fractopiaStoragePrefix;
  },
  //eslint-disable-next-line
  fullSpaceUrl(state, getters, rootState, rootGetters) {
    return rootGetters["spaces/fullSpaceUrl"];

    // check if url is from current space
  },
};

// actions
const actions = {
  async login(context, { userUrl }) {
    context.commit("setProcessing", true);

    if (!getDefaultSession().info.isLoggedIn) {
      await login({
        oidcIssuer: userUrl,
        redirectUrl: window.location.href,
        clientName: "Fractopia",
      });
    }
    context.commit("setWebId", getDefaultSession().info.webId);
    context.commit("setProcessing", false);
  },

  async silentLogin(context) {
    context.commit("setProcessingSilent", true);
    await handleIncomingRedirect({ restorePreviousSession: true });
    context.commit("setWebId", getDefaultSession().info.webId);
    await context.dispatch("spaces/loadSpaces", null, { root: true });
    context.commit("setProcessingSilent", false);
  },
  async logout(context) {
    await logout();
    context.commit("setWebId", null);
  },
  async initialSetup() {
    // context.commit('setProcessingStatus', processingStates.initialSetup)
    // verifies if index hiperfolder already exists
    // otherwise, creates one
    // // search for index note
    // var existentNote = await Note.find(
    //   Note.defaultCollectionUrl + "index#" + Note.nameForSoloThing
    // );
    // // creates index note if there is none
    // if (!existentNote) {
    //   var welcomeNote = new Note({
    //     content: "# This is your place",
    //     title: "Welcome to Fractopia",
    //     id: "index",
    //   });
    //   // add note backlink to hiperfolder list
    //   welcomeNote.addFolder(targetFolder.url);
    //   await welcomeNote.save();
    // }
    // context.dispatch('portals/getAvailablePortals', null, { root: true }).then(
    //   context.dispatch('portals/activatePortal', null, { root: true })
    // )
    // context.dispatch("notes/getNote", Note.defaultCollectionUrl + "index", {
    //   root: true,
    // });
    // context.commit('setProcessingStatus', null)
    // context.commit('setInitializationStatus', true)
  },
  setSpaceStorage(context, spaceStorage) {
    context.commit("setSpaceStorage", spaceStorage);
    context.commit("setInitializationStatus", false);
    context.dispatch("checkSpaceStatus");
  },
};

// mutations
const mutations = {
  setProcessing(state, status) {
    state.processing = status;
  },
  setProcessingSilent(state, status) {
    state.processingSilent = status;
  },
  setProcessingStatus(state, status) {
    state.processingStatus = status;
  },
  setWebId(state, webId) {
    state.webId = webId;
  },
  setSpaceStorage(state, spaceStorage) {
    state.spaceStoragePrefix = spaceStorage;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
