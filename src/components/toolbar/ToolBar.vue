<template>
  <div>
    <v-speed-dial
      class="ma-6"
      v-model="fab"
      direction="top"
      transition="scale-transition"
      open-on-hover
      absolute
      bottom
    >
      <template v-slot:activator>
        <div class="d-flex flex-column align-center">
          <v-btn x-large v-model="fab" color="blue darken-2" dark fab>
            <v-icon v-if="fab"> mdi-close </v-icon>
            <v-icon v-else> mdi-account-circle </v-icon>
          </v-btn>
          <p class="mt-2">{{ context.name }}</p>
          <v-text-field
            @blur="changeContext"
            v-model="contextInput"
            placeholder="@contexto"
          />
        </div>
      </template>
      <logout-button />
      <new-note-button />
    </v-speed-dial>
  </div>
</template>

<script>
import LogoutButton from "./LogoutButton.vue";
import NewNoteButton from "./NewNoteButton.vue";
export default {
  name: "ToolBar",
  components: { LogoutButton, NewNoteButton },
  data() {
    return {
      fab: false,
      contextInput: "",
    };
  },
  computed: {
    context() {
      return this.$store.state.auth.spaceStoragePrefix;
    },
  },
  created() {
    this.contextInput = this.context;
  },

  methods: {
    changeContext() {
      this.$store.dispatch("auth/setSpaceStorage", this.contextInput);
    },
  },
};
</script>
