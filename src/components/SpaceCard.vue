<template>
  <v-card class="mx-auto" max-width="344">
    <v-card-text>
      <!-- <div>{{ name }}</div> -->
      <p class="text-h4 text--primary">{{ name }}</p>
      <p v-if="inUserPod">In Your pod</p>
      <div class="text--primary">
        {{ description }}
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn text color="teal accent-4" @click="activateSpace">
        Click to enter
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  created() {},
  props: ["name", "description", "url"],
  computed: {
    inUserPod() {
      return this.$props.url?.includes(this.$store.getters["auth/podUrl"]);
    },
  },
  methods: {
    async activateSpace() {
      this.$store.dispatch("notes/getNote", this.$attrs.href);
    },
  },
};
</script>
