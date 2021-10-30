import {
  handleIncomingRedirect,
  login,
  logout,
  // fetch,
  getDefaultSession,
} from "@inrupt/solid-client-authn-browser";
import Note from "../../models/Note";

// initial state
const state = () => ({
  processing: false,
  processingSilent: false,
  webId: null,
  sessionId: null,
});

// getters
const getters = {};

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
    var welcomeNote = new Note({
      content: "# Benvindes a Fractopia",
      title: "Bemvindes",
      id: "index",
    });

    await welcomeNote.save();
    if (!welcomeNote.new) context.commit("notes/setNote", welcomeNote);

    // createContainer if not
    // create default workspaces
    // private
    // networked
    // set defaultcontext
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
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
