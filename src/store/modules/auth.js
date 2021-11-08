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
import Portal from "../../models/Portal";

// initial state
const state = () => ({
  processing: false,
  processingSilent: false,
  webId: null,
  fractopiaStoragePrefix: "public/fractopia/v0.002/",
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

    // var existent = await HiperFolder.find(context.getters.fullSpaceUrl + );

    // verifies if index hiperfolder already exists
    // otherwise, creates one
    var indexFolder = await HiperFolder.find(
      HiperFolder.defaultCollectionUrl + "index#self"
    )

    if (!indexFolder) {

      indexFolder = new HiperFolder({
        id: "index",
        name: "Index",
        itemTypes: [HiperFolder],
      });

      await indexFolder.save();
    }

    // verifies if there is any object of type container inside indexFolder
    let targetFolder = null
    for (let item of indexFolder.items) {
      if (item.type === indexFolder.rdfsClasses[0]) {
        targetFolder = new HiperFolder({ url: item.url })
      }
    }
    if (!targetFolder) {
      targetFolder = new HiperFolder({
        name: "Notes",
        itemTypes: [HiperFolder],
      });
      targetFolder = await targetFolder.save();
    }

    await indexFolder.addReference({
      name: targetFolder.name,
      url: targetFolder.url,
      type: targetFolder.rdfsClasses[0]
    });

    var portalIndex = await HiperFolder.find(
      context.getters.fullSpaceUrl + Portal.defaultCollectionPrefix + "index#self"
    )
    if (!portalIndex) {
      portalIndex = new HiperFolder({
        name: "index",
        url: context.getters.fullSpaceUrl + Portal.defaultCollectionPrefix + "index#self",
        itemTypes: [Portal],
      });
      await portalIndex.save()
    }

    let portal;

    if (portalIndex.defaultLink) {
      portal = await Portal.find(portalIndex.defaultLink)
    } else {
      console.warn('Dead Default Link for portal', portalIndex.defaultLink)
    }

    if (portalIndex.items.length > 0) {
      portal = await Portal.find(
        portalIndex.items)
    }

    if (!portal) {
      portal = new Portal({
        name: 'Pessoal',
        description: 'Teste',
        id: 'pessoal',
        portalInterface: 'index',
        subPortals: ['files', 'notes'],
        defaultSubPortal: 'notes'
      })
      portal.addFolder(portalIndex.url)

      await portal.save()
      portalIndex.defaultLink = portal.url
      await portalIndex.save()
    }

    // search for index note
    var existentNote = await Note.find(
      Note.defaultCollectionUrl + "index#" + Note.nameForSoloThing
    );

    // creates index note if there is none
    if (!existentNote) {
      var welcomeNote = new Note({
        content: "# Benvindes a Fractopia",
        title: "Bemvindes",
        id: "index",
      });
      // add note backlink to hiperfolder list
      welcomeNote.addFolder(targetFolder.url);

      await welcomeNote.save();
    }
    context.dispatch('portals/getAvailablePortals', null, { root: true }).then(
      context.dispatch('portals/activatePortal', null, { root: true })

    )

    context.dispatch("notes/getNote", Note.defaultCollectionUrl + "index", {
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
