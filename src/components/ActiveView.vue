<template>
  <div>
    <root-interface>
      <component :is="activePortalInterface" />
    </root-interface>
  </div>
</template>
<script>
import NoteInterface from "./portalInterfaces/NoteInterface.vue";
import FileTreeInterface from "./portalInterfaces/FileTreeInterface.vue";

import RootInterface from "./portalInterfaces/RootInterface.vue";

export default {
  components: { RootInterface },

  computed: {
    activePortal() {
      return this.$store.state.portals.activePortal || {};
    },
  },
  watch: {
    activePortal(newvalue) {
      switch (newvalue.defaultSubPortal) {
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
