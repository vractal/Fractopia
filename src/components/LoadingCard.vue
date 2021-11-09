<template>
  <v-sheet
    elevation="0"
    class="d-flex justify-center align-center"
    height="100%"
  >
    <v-sheet
      elevation="1"
      class="pa-8 d-flex justify-center align-center flex-column"
    >
      <v-progress-circular
        class="pa-2"
        color="primary"
        :size="90"
        indeterminate
      />
      <h2>Calculating fractals</h2>
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

