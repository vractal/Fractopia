// eslint-disable-file
// import NoteContainer from '@/models/NoteContainer'
// eslint-disable-next-line
import Note from "@/models/Note";

// initial state
const state = () => ({
  processing: false,
  activeNote: null,

});

// getters
const getters = {};

// actions
const actions = {
  //
  async getNote(context, url) {
    let note = await Note.find(url);
    context.commit("setNote", note);
  },
  createNote(context) {
    context.commit("setNote", { content: "", title: "" });
  },

  async saveNote(context, { noteUrl, ...noteData }) {
    let note;
    // if (noteUrl) {
    note = await Note.find(noteUrl)
    // }

    console.log('notesaveantes', note)
    if (!note) {
      note = new Note({
        content: noteData.content,
        title: noteData.title,
      });
    }

    note.content = noteData.content
    note.title = noteData.title;
    console.log('notesdepois', note)

    if (note.hiperFolders.length === 0) {
      note.addFolder(
        context.rootGetters["auth/fullSpaceUrl"] + "hiperfolders/" + "index"
      );
    }
    note = await note.save();
    context.commit('setNote', note)
  },
};

// mutations
const mutations = {
  setNote(state, newNote) {
    // muda a nota ativa
    state.activeNote = newNote;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
