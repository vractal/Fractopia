<template>
  <generic-button icon="mdi-logout" label="logout" @click="logout" />
</template>
<script>
import GenericButton from "./GenericButton.vue";
export default {
  components: { GenericButton },
  methods: {
    async logout() {
      this.$store.dispatch("auth/logout");
    },
  },
};
</script>
