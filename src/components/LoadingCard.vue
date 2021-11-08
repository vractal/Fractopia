<template>
  <v-sheet
    elevation="0"
    class="d-flex justify-center align-center"
    height="100%"
  >
    <v-sheet
      elevation="1"
      class="pa-6 d-flex justify-center align-center flex-column"
    >
      <v-progress-circular color="primary" :size="70" indeterminate />
      <h2>Carregando Aplicação</h2>
    </v-sheet>
  </v-sheet>
</template>
<script>
export default {
  props: {
    icon: String,
    label: String,
  },
  methods: {
    async click(event) {
      this.$emit("click", event);
    },
  },
};
</script>

