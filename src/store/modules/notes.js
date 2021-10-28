// eslint-disable-file
import NoteContainer from '@/models/NoteContainer'
import Note from '@/models/Note'

// initial state
const state = () => ({
    processing: false,

});

// getters
const getters = {};

// actions
const actions = {
    // 

    async createNote(context, noteData) {
        console.log('aqui', noteData);
        // eslint-disable-next-line
        const container = new NoteContainer({ url: "https://zesolid.solidcommunity.net/public/tmp/notes/" })
        container.loadRelation('notes')
        container.relatedNotes.add(new Note({ content: noteData.content }))
        await container.save()

        // console.log('nota: ', note)
        // // note.mintUrl('https://zesolid.solidcommunity.net/public/tmp/notes/notas')
        // console.log('nota2: ', note)
        // await note.save('https://zesolid.solidcommunity.net/public/tmp/')
        // console.log('nota3: ', note)

        // Note.at('https://zesolid.solidcommunity.net/public/tmp/').create({ content: noteData.content });
    }

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
