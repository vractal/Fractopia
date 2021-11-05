import HiperFolder from "@/models/HiperFolder";

// initial state
const state = () => ({
    activeFolder: null, // url
    todos: [],
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
    //create new subhiperfolder
    async createFolder(context, { folderName, parentUrl }) {
        console.log("start createfolder: ", folderName, parentUrl)
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
        console.log("parentFolder: ", parentFolder)

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


        console.log('createfolder', parentFolder, newFolder)

    },


};

// mutations
const mutations = {
    setActiveFolder(state, folderUrl) {
        state.activeFolder = folderUrl
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
