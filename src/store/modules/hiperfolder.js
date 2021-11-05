import HiperFolder from "@/models/HiperFolder";

// initial state
const state = () => ({
    activeFolder: null,
    todos: [],
    //Storage / Browser
});

// getters
const getters = {};

// actions
const actions = {
    //create new subhiperfolder
    async createFolder(context, { folderName, parentUrl }) {
        console.log("start createfolder: ", folderName, parentUrl)
        // verifies if index hiperfolder already exists
        // otherwise, creates one
        var indexFolder = await HiperFolder.find(
            context.rootGetters['auth/fullSpaceUrl'] + "hiperfolders/" + "index"
        )

        if (!indexFolder) {

            indexFolder = new HiperFolder({
                id: "index",
                url: context.rootGetters['auth/fullSpaceUrl'] + "hiperfolders/index",
                name: "Index",
                itemTypes: [HiperFolder],
            });

            await indexFolder.save();
        }
        console.log("indexFolder: ", indexFolder)

        // create and save new folder
        let newFolder = new HiperFolder({
            name: folderName
        })

        newFolder = await newFolder.save()
        await indexFolder.addReference({
            name: newFolder.name,
            url: newFolder.url,
            type: newFolder.rdfsClasses[0]
        });


        console.log('createfolder', indexFolder, newFolder)

    },


};

// mutations
const mutations = {

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
