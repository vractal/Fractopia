<template>
  <div class="d-flex flex-column align-center">
    <v-btn small color="danger" @click="click">
      <v-icon>{{ icon }}</v-icon>
    </v-btn>
    <p>{{ label }}</p>
  </div>
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
