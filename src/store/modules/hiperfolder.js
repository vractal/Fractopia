import HiperFolder from "@/models/HiperFolder";
import Note from "@/models/Note";

// initial state
const state = () => ({
    activeFolder: null, // url
    selectedFolder: null,
    folderToReload: null,
    cache: {},
    //Storage / Browser
});

// getters
const getters = {};

// actions
const actions = {
    // set active folder globally 
    changeActiveFolder(context, folderUrl) {
        context.commit('setActiveFolder', folderUrl)
    },
    changeSelectedFolder(context, folderUrl) {
        context.commit('setSelectedFolder', folderUrl)
    },
    //create new subhiperfolder
    async createFolder(context, { folderName, parentUrl }) {
        // verifies if index hiperfolder already exists
        // otherwise, creates one
        var parentFolder = await HiperFolder.find(
            parentUrl,
        )

        if (!parentFolder) {

            parentFolder = new HiperFolder({
                id: "index",
                url: context.rootGetters['auth/fullSpaceUrl'] + "hiperfolders/index",
                name: "Index",
                itemTypes: [HiperFolder],
            });

            await parentFolder.save();
        }

        // create and save new folder
        let newFolder = new HiperFolder({
            name: folderName
        })

        newFolder = await newFolder.save()
        await parentFolder.addReference({
            name: newFolder.name,
            url: newFolder.url,
            type: newFolder.rdfsClasses[0]
        });
    },
    async removeFolder(context, folderUrl) {
        console.log('find', folderUrl)
        let folder = await Note.find(folderUrl)
        console.log('findfold', folder)

        await folder?.delete()
    }

};

// mutations
const mutations = {
    setActiveFolder(state, folderUrl) {
        state.activeFolder = folderUrl
    },
    setSelectedFolder(state, folderUrl) {
        state.selectedFolder = folderUrl
    },
    setFolderToReload(state, folderUrl) {
        state.folderToReload = folderUrl
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};

