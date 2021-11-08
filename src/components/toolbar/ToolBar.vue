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
        </div>
        <portal-switch />
      </template>
      <logout-button />
      <generic-button
        @click="showFileManager"
        label="files"
        icon="mdi-folder"
      />
    </v-speed-dial>
  </div>
</template>

<script>
import GenericButton from "./GenericButton.vue";
import LogoutButton from "./LogoutButton.vue";
import PortalSwitch from "./PortalSwitch.vue";
export default {
  name: "ToolBar",
  components: { LogoutButton, GenericButton, PortalSwitch },
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
    showFileManager() {
      console.log("filemanager");
    },
    changeContext() {
      this.$store.dispatch("auth/setSpaceStorage", this.contextInput);
    },
  },
};
</script>
