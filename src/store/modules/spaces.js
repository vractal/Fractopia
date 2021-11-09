// eslint-disable-file
// import NoteContainer from '@/models/NoteContainer'
// eslint-disable-next-line
import Space from "@/models/Space";
import find from 'lodash/find'
import HiperFolder from "@/models/HiperFolder";
import Portal from "@/models/Portal";
import Note from "@/models/Note";
import { v4 as uuidv4 } from "uuid";
import processingStates from "@/utils/processingStates";
import { putEndSlash } from "@/utils/utils";

// initial state
const state = () => ({
    processingStatus: false,
    activeSpaceUrl: null, // space object 
    isInitialized: false,
    availableSpaces: {},
    cache: {}
});

// getters
const getters = {
    activeSpace(state) {
        return state.availableSpaces[state.activeSpaceUrl]
    },
    //eslint-disable-next-line
    fullSpaceUrl(state, getters) {

        return putEndSlash(getters['activeSpace']?.storagePath)
    }
}
// actions
const actions = {
    async createSpaceBasics(context, space) {
        // Create index hiperfolder to use as default in space
        let normalizedUrl = putEndSlash(space.storagePath)

        var indexFolder = new HiperFolder(
            {
                datasetUrl: normalizedUrl + HiperFolder.defaultCollectionPrefix + uuidv4(),
                id: "index",
                name: "Index",
            }
        )
        indexFolder = await indexFolder.save()

        // create portals index and initial portal
        let portalIndex = new HiperFolder({
            name: "index",
            url: normalizedUrl + Portal.defaultCollectionPrefix + "index#self",
            itemTypes: [Portal],
        });
        portalIndex = await portalIndex.save()


        let portal = new Portal({
            name: 'Pessoal',
            description: 'Teste',
            datasetUrl: normalizedUrl + Portal.defaultCollectionPrefix + uuidv4(),
            portalInterface: 'index',
            subPortals: ['files', 'notes'],
            defaultSubPortal: 'notes'
        })
        portal.addFolder(portalIndex.url)

        portal = await portal.save()

        portalIndex.defaultLink = portal.url
        portalIndex = await portalIndex.save()


        // create notes folder for welcome note

        let notesFolder = new HiperFolder({
            name: "Notes",
            datasetUrl: normalizedUrl + HiperFolder.defaultCollectionPrefix + uuidv4(),

            itemTypes: [HiperFolder],
        });
        notesFolder.addFolder(indexFolder.url)
        notesFolder = await notesFolder.save();

        // Create welcome note
        let welcomeNote = new Note({
            content: "# This is your place",
            title: "Welcome to Fractopia",
            id: "index",
            datasetUrl: normalizedUrl + Note.defaultCollectionPrefix + uuidv4(),
        });

        // add note backlink to hiperfolder list
        welcomeNote.addFolder(notesFolder.url);

        welcomeNote = await welcomeNote.save();
        if (indexFolder, portalIndex, portal, welcomeNote) {
            space.portalIndex = portalIndex.url
            space.defaultIndexFolder = indexFolder.url
            await space.save()
            return { space, indexFolder, portalIndex }
        } else {
            throw new Error('Failed creating space', { space, indexFolder, portalIndex })
        }


    },
    async createSpace(context, newSpaceData) {
        context.commit("setProcessingStatus", processingStates.creatingSpace);

        let space = new Space(newSpaceData)
        await space.save()

        if (space) {
            let availableSpaces = context.state.availableSpaces
            availableSpaces[space.url] = space
            context.commit('setAvailableSpaces', availableSpaces)
            context.dispatch('createSpaceBasics', space).then(result => {
                context.dispatch('checkAndSetSpace', result)
                context.commit("setProcessingStatus", false);

            }).catch(error => {
                console.warn('Failed setting up space', error)
                context.commit('setSpaceInitializedStatus', false)
                context.commit('setActiveSpace', null)
                context.commit("setProcessingStatus", false);

            })

        } else {
            console.warn('Failed creating space', newSpaceData)
        }
        // set space as active?
        // checkSpaceStatus?
        // check in list if non repeated url
    },
    async loadSpaces(context) {
        let availableSpaces = context.state.availableSpaces
        if (context.getters.activeSpace && context.state.isInitialized) {
            return;
        } else {

            if (Object.keys(availableSpaces).length === 0) {
                availableSpaces = await Space.getAllAvailable(true)
                context.commit('setAvailableSpaces', availableSpaces)
            }

            let defaultSpace = find(availableSpaces, 'isDefaultSpace')
            if (defaultSpace) {
                context.dispatch('checkAndSetSpace', { space: defaultSpace })

            }
        }

    },
    async checkAndSetSpace(context, { space, indexFolder: indexFolderObj, portalIndex: portalIndexObj }) {
        // indexfolder
        let indexFolder = indexFolderObj || await HiperFolder.find(space.defaultIndexFolder)
        let portalIndex = portalIndexObj || await HiperFolder.find(space.portalIndex)

        if (indexFolder?.url && (portalIndex.defaultLink || portalIndex.items.length > 0)) {
            context.dispatch('hiperfolder/changeActiveFolder', indexFolder.url, { root: true })
            context.dispatch('portals/activatePortal', portalIndex.defaultLink || portalIndex.items[0].url, { root: true })
            context.commit('setSpaceInitializedStatus', true)
            context.commit('setActiveSpace', space.url)

        } else {


            context.commit('setSpaceInitializedStatus', false)
            context.commit('setActiveSpace', null)

        }
        // portalIndex

    },
    deleteSpace() {

    },
    setActiveSpace(context, spaceUrl) {
        context.commit('setActiveSpace', spaceUrl)
    }
    //
};

// mutations
const mutations = {
    setActiveSpace(state, spaceUrl) {
        state.activeSpaceUrl = spaceUrl
    },
    setAvailableSpaces(state, availableSpaces) {
        state.availableSpaces = availableSpaces
    },
    setProcessingStatus(state, status) {
        state.processingStatus = status;
    },
    setSpaceInitializedStatus(state, status) {
        state.isInitialized = status
    }

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
