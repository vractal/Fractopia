import Portal from "@/models/Portal";
import HiperFolder from "@/models/HiperFolder";

// import { rdfs, schema } from "rdf-namespaces";
// import { getUrl } from "@inrupt/solid-client";

// initial state
const state = () => ({
    activePortal: null,
    availablePortals: [],
    activeSubPortal: null
});

// getters
const getters = {
};

// actions
const actions = {
    init() {

    },
    async getAvailablePortals(context) {
        let portals = []
        let portalIndexUrl = context.rootGetters['auth/fullSpaceUrl'] + Portal.defaultCollectionPrefix + 'index#self'
        let indexPortalFolder = await HiperFolder.find(portalIndexUrl)
        if (!indexPortalFolder) {
            return;
        }
        let dummyPortal = new Portal({})
        for (let indexThing of indexPortalFolder.items) {
            if (indexThing.type === dummyPortal.rdfsClasses[0]) {
                // let url = getUrl(indexThing, schema.relatedLink)
                let portal = await Portal.find(indexThing.url)
                if (portal) portals.push(portal)
            }
        }

        context.commit('setAvailablePortals', portals)
        return true
    },
    async createPortal(context, newPortalData) {
        let indexFolderUrl = Portal.defaultCollectionUrl + 'index#self'
        let portal = new Portal(newPortalData)
        portal.addFolder(indexFolderUrl)
        try {
            portal = await portal.save()
            context.commit('setActivePortal', portal)
            if (portal.defaultSubPortal) {
                context.commit('setActiveSubPortal', portal.defaultSubPortal)

            }

        } catch (error) {
            console.warn('Failed creating portal', error)
        }

    },
    async setActiveSubportal(context, subportal) {
        context.commit('setActiveSubPortal', subportal)
    },
    async activatePortal(context, url) {
        let portal = await Portal.find(url)
        if (portal) {

            context.commit('setActivePortal', portal)
        } else {
            if (!context.state.activePortal) {
                if (context.state.availablePortals.length > 0) {
                    context.commit('setActivePortal', context.state.availablePortals[0])

                } else {
                    console.warn("No context found")
                }
            }
        }
    }


};

// mutations
const mutations = {
    setAvailablePortals(state, portals) {
        state.availablePortals = portals
    },
    setActivePortal(state, portal) {
        state.activePortal = portal
    },
    setActiveSubPortal(state, subPortal) {
        state.activeSubPortal = subPortal
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
