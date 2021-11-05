<template>
  <v-sheet
    :elevation="editorToggle ? 0 : 2"
    class="container pa-4"
    color="white"
    max-width="900"
    rounded
  >
    <div v-if="note !== null" class="d-flex flex-column justify-space-between">
      <v-text-field :disabled="!editorToggle" v-model="title" />
      <v-md-editor
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
  </v-sheet>
</template>
<script>
import { debounce } from "lodash";
export default {
  created() {},
  data: () => ({
    localContent: "",
    title: "",
    md: null,
    editorToggle: false,
  }),
  computed: {
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
      });
      console.log("postNote: ", this.$store.state.notes.activeNote);
    },

    throttledPostNote() {
      this.postNote();
      // return throttle(this.postNote, 1000, { trailing: true });
    },
  },
};
</script>
