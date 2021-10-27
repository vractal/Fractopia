import {
  handleIncomingRedirect,
  login,
  logout,
  // fetch,
  getDefaultSession,
} from "@inrupt/solid-client-authn-browser";

// initial state
const state = () => ({
  webId: null,
  sessionId: null,
});

// getters
const getters = {};

// actions
const actions = {
  async login(context, { userUrl }) {
    // 1. Call the handleIncomingRedirect() function to complete the authentication process.
    //   If the page is being loaded after the redirect from the Solid Identity Provider
    //      (i.e., part of the authentication flow), the user's credentials are stored in-memory, and
    //      the login process is complete. That is, a session is logged in
    //      only after it handles the incoming redirect from the Solid Identity Provider.
    //   If the page is not being loaded after a redirect from the Solid Identity Provider,
    //      nothing happens.
    // 2. Start the Login Process if not already logged in.
    if (!getDefaultSession().info.isLoggedIn) {
      // The `login()` redirects the user to their identity provider;
      // i.e., moves the user away from the current page.
      await login({
        // Specify the URL of the user's Solid Identity Provider; e.g., "https://broker.pod.inrupt.com" or "https://inrupt.net"
        oidcIssuer: userUrl,
        // Specify the URL the Solid Identity Provider should redirect to after the user logs in,
        // e.g., the current page for a single-page app.
        redirectUrl: window.location.href,
        // Pick an application name that will be shown when asked
        // to approve the application's access to the requested data.
        clientName: "Fractopia",
      });
    }
    context.commit("setWebId", getDefaultSession().info.webId);
  },
  async silentLogin(context) {
    await handleIncomingRedirect({ restorePreviousSession: true });
    console.log("session", getDefaultSession());
    context.commit("setWebId", getDefaultSession().info.webId);
  },
  async logout(context) {
    await logout();
    context.commit("setWebId", null);
  },
};

// mutations
const mutations = {
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
