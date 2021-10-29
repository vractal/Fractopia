<template>
  <generic-button icon="mdi-plus" label="Nova" @click="newNote" />
</template>
<script>
import GenericButton from "./GenericButton.vue";
export default {
  components: { GenericButton },
  methods: {
    async newNote() {
      this.$store.dispatch("notes/createNote");
    },
  },
};
</script>
