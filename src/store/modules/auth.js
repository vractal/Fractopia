import {
  handleIncomingRedirect,
  login,
  logout,
  // fetch,
  getDefaultSession,
} from "@inrupt/solid-client-authn-browser";
import Note from "../../models/Note";
import HiperFolder from "../../models/HiperFolder";
import { getPodUrlFromWebId } from "@/utils/utils";

// initial state
const state = () => ({
  processing: false,
  processingSilent: false,
  webId: null,
  fractopiaStoragePrefix: "public/temp/fractopia/",
  spaceStoragePrefix: "pessoal/",
  hiperFolderPrefix: "hiperfolders/",
  sessionId: null,
});

// getters
const getters = {
  podUrl() {
    return getPodUrlFromWebId(state.webId);
  },
  fullSpaceUrl(state) {
    return (
      getPodUrlFromWebId(state.webId) +
      state.fractopiaStoragePrefix +
      state.spaceStoragePrefix
    );
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
  async initialSetup(context) {
    // console.log('existentNote')

    var existentNote = await Note.find(
      context.getters.fullSpaceUrl + "notes/" + "index"
    );
    // console.log()
    // var existent = await HiperFolder.find(context.getters.fullSpaceUrl + );

    // verifica se existe pasta com lista
    // se não tiver, cria

    var hiperFolder = await HiperFolder.find(
      context.getters.fullSpaceUrl + "hiperfolders/" + "index"
    )

    if (!hiperFolder) {

      hiperFolder = new HiperFolder({
        id: "index",
        url: context.getters.fullSpaceUrl + "hiperfolders/index",
        name: "Index",
        itemTypes: [HiperFolder],
      });

      await hiperFolder.save();
    }


    if (!existentNote) {
      var welcomeNote = new Note({
        content: "# Benvindes a Fractopia",
        title: "Bemvindes",
        id: "index",
      });
      welcomeNote.addFolder(hiperFolder.url);

      await welcomeNote.save();
    }

    context.dispatch("notes/getNote", context.getters.fullSpaceUrl + "index", {
      root: true,
    });

    // createContainer if not
    // create default workspaces
    // private
    // networked
    // set defaultcontext
  },
  setSpaceStorage(context, spaceStorage) {
    context.commit("setSpaceStorage", spaceStorage);
    context.dispatch("initialSetup");
  },
  async silentLogin(context) {
    context.commit("setProcessingSilent", true);
    await handleIncomingRedirect({ restorePreviousSession: true });
    context.commit("setWebId", getDefaultSession().info.webId);
    context.dispatch("initialSetup");
    context.commit("setProcessingSilent", false);
  },
  async logout(context) {
    await logout();
    context.commit("setWebId", null);
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
  setWebId(state, webId) {
    console.log("oi", webId);

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
