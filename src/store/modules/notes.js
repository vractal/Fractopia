// eslint-disable-file
// import NoteContainer from '@/models/NoteContainer'
// eslint-disable-next-line
import Note from "@/models/Note";

// initial state
const state = () => ({
  processing: false,
  activeNote: null,
  openedNotes: [], // { title, url }
  cache: {}
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
  createNote(context, parentUrl) {
    context.commit("setNote", { content: "", title: "", hiperFolders: [parentUrl] });
    // console.log('createNote', context, parentUrl, context.rootState.hiperfolder.activeFolder);
  },

  async saveNote(context, { noteUrl, parentUrl, ...noteData }) {
    let note;
    // if (noteUrl) {
    note = await Note.find(noteUrl)
    // }

    console.log('notesaveantes', parentUrl)
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
      let folderUrl = parentUrl ? parentUrl : context.rootGetters["auth/fullSpaceUrl"] + "hiperfolders/" + "index"
      note.addFolder(folderUrl);
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
    if (!(newNote.title === "" && newNote.title === "")) {
      state.openedNotes.push({ title: newNote.title, url: newNote.url });
      if (newNote.url || newNote.noteUrl) {
        let url = newNote.url || newNote.note
        state.cache[url] = newNote;
      }

    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
