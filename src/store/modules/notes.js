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
  async getNote(context, query) {
    let note = await Note.find(query);
    context.commit("setNote", note);
  },
  createNote(context) {
    console.log("createnote");
    context.commit("setNote", { content: "", title: "" });
  },

  async saveNote(context, noteData) {
    let newNote = new Note({
      content: noteData.content,
      title: noteData.title,
      id: noteData.id,
    });
    await newNote.save();
    console.log("Create", noteData, newNote);
    // context.commit("setNote", newNote);
  },
};

// mutations
const mutations = {
  setNote(state, newNote) {
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
