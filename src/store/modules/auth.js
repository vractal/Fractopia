import {
  handleIncomingRedirect,
  login,
  logout,
  // fetch,
  getDefaultSession,
} from "@inrupt/solid-client-authn-browser";

// initial state
const state = () => ({
  processing: false,
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
  async silentLogin(context) {
    context.commit("setProcessing", true);

    await handleIncomingRedirect({ restorePreviousSession: true });
    context.commit("setWebId", getDefaultSession().info.webId);
    context.commit("setProcessing", false);
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
