<template>
  <generic-button :label="label" :icon="finalIcon" @click="onClick" />
</template>
<script>
import GenericButton from "./GenericButton.vue";
export default {
  components: { GenericButton },
  props: {
    icon: String,
    label: String,
    type: String,
  },
  computed: {
    finalIcon() {
      if (this.$props.icon) {
        return this.$props.icon;
      }
      switch (this.$props.type) {
        case "files":
          return "mdi-folder";
        case "notes":
          return "mdi-note";
        case "spaces":
          return "mdi-cube";
        default:
          return "mdi-tool";
      }
    },
  },
  methods: {
    async onClick() {
      this.$store.dispatch("portals/setActiveSubportal", this.$props.type);
    },
  },
};
</script>
