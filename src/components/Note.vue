<template>
  <v-sheet
    :elevation="editorToggle ? 0 : 2"
    class="container pa-4"
    color="white"
    max-width="900"
  >
    <div class="d-flex flex-column  justify-space-between ">
      <v-md-editor
        v-model="note"
        :mode="mode"
        tolbar="{}"
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
  data: () => ({ note: "# Title", md: null, editorToggle: false }),
  computed: {
    mode() {
      return this.editorToggle ? "edit" : "preview";
    },
  },

  methods: {
    onEdit(event) {
      this.note = event.target.innerText;
    },
  },
};
</script>
