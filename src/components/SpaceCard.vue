<template>
  <div>
    <v-card class="ma-4 pa-2" max-width="460">
      <v-card-text>
        <!-- <div>{{ name }}</div> -->
        <p class="text-h4 text--primary">{{ name }}</p>
        <p v-if="inUserPod">In Your pod</p>
        <div class="text--primary">
          {{ description }}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          block
          class="white--text text--bold"
          color="purple "
          @click="activateSpace"
          dense
          rounded
          outlined
        >
          Click to enter
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
// import Space from "@/models/Space";
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
      // let space = await Space.find(this.$props?.url);
      let space = this.$store.state.spaces.availableSpaces[this.$props.url];
      if (space) {
        this.$store.dispatch("spaces/checkAndSetSpace", {
          space,
        });
      }
    },
  },
};
</script>
