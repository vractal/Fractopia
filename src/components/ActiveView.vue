<template>
  <div>
    <root-interface v-if="isSpaceInitialized">
      <component v-if="activePortalInterface" :is="activePortalInterface" />
    </root-interface>
    <space-setup-pop-up v-else />
  </div>
</template>
<script>
import NoteInterface from "./portalInterfaces/NoteInterface.vue";
import FileTreeInterface from "./portalInterfaces/FileTreeInterface.vue";

import RootInterface from "./portalInterfaces/RootInterface.vue";
import SpaceSetupPopUp from "./SpaceSetupPopUp.vue";
export default {
  components: { RootInterface, SpaceSetupPopUp },

  computed: {
    activePortal() {
      return this.$store.state.portals?.activePortal || {};
    },
    isSpaceInitialized() {
      return this.$store.state.auth.isSpaceInitialized;
    },
    activeSubPortal() {
      return this.$store.state.portals?.activeSubPortal;
    },
  },
  watch: {
    activeSubPortal(newActiveSubPortal) {
      console.log("subportal", newActiveSubPortal);
      switch (newActiveSubPortal) {
        case "notes":
          this.activePortalInterface = NoteInterface;
          break;
        case "files":
          this.activePortalInterface = FileTreeInterface;
          break;

        default:
          this.activePortalInterface = null;
          break;
      }
    },
  },
  data: () => ({
    active: "note",
    showFileManager: true,
    activePortalInterface: null,
  }),
};
</script>
