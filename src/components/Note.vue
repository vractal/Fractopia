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
      <v-text-field
        placeholder="Title"
        :disabled="!editorToggle"
        v-model="title"
      />
      <markduck v-if="!editorToggle" :markdown="localContent" />

      <v-md-editor
        v-else
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
    <v-sheet
      elevation="3"
      v-if="pressed"
      rounded
      class="link-popup d-flex pa-2 flex-row"
      @keyup.esc="pressed = false"
    >
      <v-icon class="mx-2 pb-2" big color="purple" @click="createLink"
        >mdi-link</v-icon
      >
      <v-autocomplete
        return-object
        autofocus
        dense
        :items="recentLinksItems"
        v-model="linkInput"
        placeholder="Type the name of note you want to link (needs to visit before)"
      />

      <v-icon class="mx-2" color="purple" @click="createLink">mdi-check</v-icon>
      <v-icon class="mx-2" color="purple" @click="pressed = false"
        >mdi-close</v-icon
      >
    </v-sheet>
  </v-sheet>
</template>
<script>
// eslint-disable-file
import { debounce, filter, map } from "lodash";
import markduck from "markduckjs";
// import gemojiToEmoji from "remark-gemoji-to-emoji";
import rehypePrism from "@mapbox/rehype-prism";

import "prismjs/themes/prism.css";
import NoteLink from "@/components/NoteLink";
import "@kangc/v-md-editor/lib/theme/style/github.css";
// eslint-disable-next-line
// import rehypeStringify from "rehype-stringify";
// import rehypeRaw from "rehype-raw";
// import remarkParse from "remark-parse";
// import remark2rehype from "remark-rehype";
// import rehypeAttrs from "rehype-attr";
// eslint-disable-next-line

export default {
  components: {
    markduck: markduck({
      // remarkPlugins: [remarkParse, { linkify: false }, [remark2rehype]],
      rehypePlugins: [rehypePrism],
      components: {
        a: NoteLink,
      },
    }),
  },
  created() {
    this.localContent = this.note || "";
    this.title = this.storeTitle || "";
  },
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
        this.localContent = this.note || "";
      }
    },
    note(newValue) {
      console.log("newValueNote", newValue);
      this.localContent = this.note || "";
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
        parentUrl: this.$store.state.hiperfolder.selectedFolder,
      });
    },
    pressedKey(value) {
      this.pressed = true;
      this.lastCursorPosition = value.target.selectionStart;
    },
    editorShortcut() {
      this.editorToggle = !this.editorToggle;
    },
    createLink() {
      this.pressed = false;
      if (this.linkInput) {
        let text = `[#${this.linkInput.text}](${this.linkInput.value})`;
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
<style >
.link-popup {
  margin-top: -40px;
  z-index: 9999999999999999999999999 !important;
}
</style>