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
            subPortals: ['files', 'notes', 'spaces'],
            defaultSubPortal: 'notes',
            hiperFolders: [portalIndex.url]

        })

        portal = await portal.save()

        var portalSpaces = new Portal({
            name: 'Spaces',
            description: 'Usefull to see spaces you have',
            datasetUrl: normalizedUrl + Portal.defaultCollectionPrefix + uuidv4(),
            portalInterface: 'index',
            subPortals: ['spaces'],
            defaultSubPortal: 'spaces',
            hiperFolders: [portalIndex.url]
        })

        portalSpaces = await portalSpaces.save()

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

        let noteText = ```
        
# Welcome to Fractopia!

## What is Fractopia?

Fractopia is an outline of a new way of relating in the digital age. Not only human, and human-object relations, but also the relations we have with our data.

Fractopia intents to be a layer on top of data. Instead of a platform or app, a layer that uses semantic data to define how you see and interact with linked data (and thus, the world).

This new perspective is possible due to Solid. Solid enables people to take control of their data by storing them in decentralized data stores called Pods. Pods are like secure personal web servers for data. When data is stored in someone's Pod, they control which people and applications can access it.

## Important concepts in Fractopia

Here we define some concepts that constitute the basis of Fractopia and you are going to see a lot around here.

- Spaces:
    
    - Spaces are Storages where data of a profile or group is stored at. It also contains access control information.
        
- Portals:
    
    - Portals are the interfaces by which people interact with their data. You look networks of data through your portals. This portals can define what types of data/relations you are interested in, how can you act on this data and even the interface. You can configure and share them, with different tools and components. Basically, everything inside a Portal is a Portal as well, that may contain other Portals. Portals are defined by semantic data stored in pods, so they can easily be shared. Any non-tech oriented person should be able to create new portals to visualize and interact with data (and other people, and the world) in their own way.
        
- HyperFolders (in the search for a better name):
    
    - HyperFolders are collections of links to things and their relations. You can see them as folders, but they are really graphs. Your personal graphs, your mind map to the data you care about. They are not bound to regular folders, as they are links that lead to other links and things. So one thing can be in many hyperfolders, and one hyperfolder can contain data from many spaces.
        
- Dynamic vocabularies and shared ontologies
    
    - One of the main goals of Fractopia is a place where anyone can experience the digital space itself as home. That is, not only feel comfortable in a specific social media or forum, but in to the entire network. And that's possible, because in Fractopia we are the crafters of our own network.
        
    - In order to do that, the user must be able to define their own ontologies as easily as they think them but, at the same time, the more connections, the better.
        
    - To conciliate that, besides being able to define new concepts and relations for data easily, people should be able to discuss and share their ontologies, using a mix of personal, local and global vocabularies for instance. Thus we allow for diversity and localization without giving up on integration.
        

# Roadmap and future goals

- Create personalized types of data, such as recipes, musics, books, events, and ways of interacting with them;
- Include management tasks, forums, and blogs functionalities;
- Create Libraries and Groups tools: ways of sharing and visualizing any kind of data and relations;
- Try integrations with other Solid-powered technologies that already exists;
- Strategic discussion about how to make Fractopia flourish, with a broader community.

## A Fractopic dream

We'll tell a story, maybe a future one, about Fractopia, and how it could be used. We hope that it gives a better idea of what we can build with Fractopia

Jane lives in Manaus, 37, and wanted to learn how to grow her own food. She doesn't know how, but she hears there is a place she can find communities about pretty much anything people do. She decides to try it out. "Fractopia, weird name". Seemed a little confusing at first, but after a while it started to make sense.

She had a space to keep things, and connect things together. She had Portals through which she could see and interact with things. After that, she decided to venture in the social portal. There, she found a big community from Manaus, and through its portals got to know a lot of different parts of the town.

Among them, a group of permacultors, whom happily replied in joining and added her in their space. saw a portal with up to date information like best vegetables to grown that month, projections, curated news (actually, 4 different collections sometimes quite disagreeing), weather reports. In another, people discussed their experiences and learned together in permaculture and non-permaculture related topics. They had a so called collection with information about every plant and animal you could imagine. Some were from their own space, some were shared and linked from all over the globe.


        ```
        // Create welcome note
        let welcomeNote = new Note({
            content: noteText,
            title: "Welcome to Fractopia",
            id: "index",
            datasetUrl: normalizedUrl + Note.defaultCollectionPrefix + uuidv4(),
        });

        // add note backlink to hiperfolder list
        welcomeNote.addFolder(notesFolder.url);

        welcomeNote = await welcomeNote.save();
        if (indexFolder, portalIndex, portal, portalSpaces, welcomeNote) {
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
        context.commit('setProcessingStatus', processingStates.loadingSpaces)

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
        context.commit('setProcessingStatus', false)

    },
    async checkAndSetSpace(context, { space, indexFolder: indexFolderObj, portalIndex: portalIndexObj }) {
        // indexfolder
        context.commit('setProcessingStatus', processingStates.settingSpace)

        let indexFolder = indexFolderObj || await HiperFolder.find(space.defaultIndexFolder)
        let portalIndex = portalIndexObj || await HiperFolder.find(space.portalIndex)
        console.log("checkAndSetSpace", indexFolder, portalIndex);

        if (indexFolder?.url && (portalIndex.defaultLink || portalIndex.items.length > 0)) {
            context.dispatch('hiperfolder/changeActiveFolder', indexFolder.url, { root: true })
            context.dispatch('portals/activatePortal', portalIndex.defaultLink || portalIndex.items[0].url, { root: true })
            let availableSpaces = context.state.availableSpaces
            availableSpaces[space.url] = space
            context.commit('setAvailableSpaces', availableSpaces)
            context.commit('setSpaceInitializedStatus', true)

            context.commit('setActiveSpace', space.url)

        } else {


            context.commit('setSpaceInitializedStatus', false)
            context.commit('setActiveSpace', null)
            context.commit('setProcessingStatus', false)

        }
        context.commit("setProcessingStatus", false);

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
