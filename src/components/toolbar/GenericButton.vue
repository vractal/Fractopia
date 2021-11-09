<template>
  <div class="white--text d-flex flex-column align-center">
    <v-btn
      class="white--text"
      small
      rounded
      color="purple darken-2"
      @click="click"
    >
      <v-icon>{{ icon }}</v-icon>
    </v-btn>
    <p class="black--text">{{ label }}</p>
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
