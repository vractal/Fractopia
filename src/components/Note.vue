<template>
  <v-sheet
    :elevation="editorToggle ? 0 : 2"
    class="container pa-4"
    color="white"
    max-width="900"
    rounded
  >
    <div
      @keyup.@="pressedKey"
      @keyup.esc="pressed = false"
      v-on:keyup.ctrl.69="editorShortcut"
      v-if="note !== null"
      class="d-flex flex-column justify-space-between"
    >
      <v-text-field :disabled="!editorToggle" v-model="title" />
      <v-md-editor
        ref="editor"
        v-model="localContent"
        :mode="mode"
        tolbar="{}"
        on
        autofocus
        left-toolbar="undo redo clear | h bold italic quote | ul ol | link image code"
        right-toolbar=""
      ></v-md-editor>
      <div class="align-self-end">
        <v-switch class="align-self-end" v-model="editorToggle">
          <template v-slot:label>
            <v-icon>mdi-pencil</v-icon>
          </template>
        </v-switch>
      </div>
    </div>
    <div v-if="pressed" class="d-flex flex-row" @keyup.esc="pressed = false">
      <v-autocomplete
        return-object
        autofocus
        outlined
        dense
        :items="recentLinksItems"
        v-model="linkInput"
        placeholed="Note name..."
      />
      <v-btn small rounded @click="createLink"
        ><v-icon>mdi-check</v-icon></v-btn
      >
      <v-btn small rounded @click="pressed = false"
        ><v-icon>mdi-close</v-icon></v-btn
      >
    </div>
  </v-sheet>
</template>
<script>
import { debounce, filter, map } from "lodash";
export default {
  created() {},
  data: () => ({
    localContent: "",
    title: "",
    md: null,
    editorToggle: false,
    pressed: false,
    linkInput: null,
    lastCursorPosition: 0,
  }),
  computed: {
    recentLinksItems() {
      return filter(
        map(this.$store.state.notes.openedNotes, (note) => ({
          text: note.title,
          value: note.url,
        })),
        "text"
      );
    },
    debouncedPostNote() {
      return debounce(this.postNote, 500);
    },
    mode() {
      return this.editorToggle ? "edit" : "preview";
    },
    note() {
      return this.$store.state.notes.activeNote?.content;
    },
    storeTitle() {
      return this.$store.state.notes.activeNote?.title;
    },
  },
  watch: {
    editorToggle() {
      if (!this.editorToggle) {
        this.debouncedPostNote();
        // /this.localContent;
      } else {
        this.localContent = this.note;
      }
    },
    note(newValue) {
      this.localContent = this.note;
      if (newValue === "") {
        this.editorToggle = true;
      } else {
        this.editorToggle = false;
      }
    },
    storeTitle(newValue) {
      this.title = newValue || "";
    },
  },

  methods: {
    postNote() {
      this.$store.dispatch("notes/saveNote", {
        content: this.localContent,
        title: this.title,
        noteUrl: this.$store.state.notes.activeNote?.url,
        parentUrl: this.$store.state.hiperfolder.activeFolder,
      });
      console.log("postNote: ", this.$store.state.notes.activeNote);
    },
    pressedKey(value) {
      this.pressed = true;
      this.lastCursorPosition = value.target.selectionStart;
      console.log("press", value);
    },
    editorShortcut() {
      this.editorToggle = !this.editorToggle;
    },
    createLink() {
      this.pressed = false;
      if (this.linkInput) {
        let text = `[${this.linkInput.text}](${this.linkInput.value})`;
        this.execInsertText(text, this.lastCursorPosition);
        this.linkInput = null;
      }
    },

    throttledPostNote() {
      this.postNote();
      // return throttle(this.postNote, 1000, { trailing: true });
    },
    execInsertText(insertText) {
      if (!insertText.length) return;
      // const textarea = this.$refs.editor.$refs.editorEngine;
      console.log("this.$refs", insertText);
      this.localContent = this.localContent + insertText;
      // const sentence = this.localContent;
      // const len = sentence.length;
      // let pos = selectionStart;
      // if (pos === undefined) {
      //   pos = 0;
      // }

      // const before = sentence.substr(0, pos);
      // const after = sentence.substr(pos, len);

      // this.value = before + insertText + after;

      // this.$nextTick().then(() => {
      //   textarea.selectionStart = pos + insertText.length;
      // });
    },
  },
};
</script>
