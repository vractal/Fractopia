<template>
  <div>
    <v-speed-dial
      class="pa-2 ma-6"
      v-model="fab"
      direction="top"
      transition="scale-transition"
      bottom
      left
      fixed
      open-on-hover
    >
      <template v-slot:activator>
        <div class="d-flex justify-start">
          <v-btn x-large v-model="fab" color="purple darken-2" dark fab>
            <!-- <v-icon v-if="fab"> mdi-set-center-right </v-icon>
            <v-icon v-else> mdi-set-left-center </v-icon> -->

            <v-icon v-if="fab"> mdi-spider-web </v-icon>
            <v-icon v-else> mdi-atom-variant </v-icon>
          </v-btn>
        </div>
      </template>
      <LogoutButton />

      <SubPortalButton
        v-for="(subportal, id) in subportals"
        v-bind:key="id"
        :label="subportal"
        :type="subportal"
      />
    </v-speed-dial>
  </div>
</template>

<script>
import LogoutButton from "./LogoutButton.vue";
import SubPortalButton from "./SubPortalButton.vue";

export default {
  name: "ToolBar",
  components: { LogoutButton, SubPortalButton },
  data() {
    return {
      fab: false,
    };
  },
  computed: {
    subportals() {
      return this.$store.state.portals.activePortal?.subPortals || [];
    },
  },

  methods: {
    showFileManager() {
      console.log("filemanager");
    },
  },
};
</script>
