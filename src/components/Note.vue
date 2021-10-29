<template>
  <v-sheet
    :elevation="editorToggle ? 0 : 2"
    class="container pa-4"
    color="white"
    max-width="900"
    rounded
  >
    <div v-if="note !== null" class="d-flex flex-column justify-space-between">
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
export default {
  data: () => ({ localContent: null, md: null, editorToggle: false }),
  computed: {
    mode() {
      return this.editorToggle ? "edit" : "preview";
    },
    note() {
      return (
        this.$store.state.notes.activeNote &&
        this.$store.state.notes.activeNote.content
      );
    },
  },
  watch: {
    editorToggle() {
      if (!this.editorToggle) {
        this.postNote();
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
  },

  methods: {
    getNote() {
      this.$store.dispatch("notes/getNote");
    },
    postNote() {
      console.log("event", this.$store.state.notes.activeNote);
      this.$store.dispatch("notes/saveNote", {
        content: this.localContent,
        noteUrl: this.$store.state.notes.activeNote.url,
      });
    },
  },
};
</script>
