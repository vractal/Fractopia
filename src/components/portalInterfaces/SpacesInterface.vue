<template>
  <div>
    <v-sheet class="d-flex justify-center text-center align-center">
      <h1>Your Spaces</h1>
    </v-sheet>
    <v-container
      max-width="960px"
      class="d-flex flex-row align-center justify-center"
    >
      <SpaceCard
        v-for="space in availableSpaces"
        v-bind:key="space.url"
        :name="space.name"
        :url="space.url"
      />
      <v-card class="mx-12" max-width="420">
        <v-card-text>
          <p class="text-h4 text--primary">Create Space</p>
          <div class="text">Then put stuff in it</div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="white--text"
            v-if="!reveal"
            block
            color="purple "
            @click="reveal = true"
          >
            create
          </v-btn>
          <v-expand-transition>
            <div v-if="reveal">
              <v-text-field
                placeholder="Enter name for your new space"
                v-model="spaceNameInput"
              />
              <v-btn
                block
                class="white--text"
                color="purple"
                :loading="!!processing"
                @click="createSpace"
              >
                Confirm
              </v-btn>
            </div>
          </v-expand-transition>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import SpaceCard from "@/components/SpaceCard.vue";
import { map } from "lodash";

export default {
  components: { SpaceCard },
  data() {
    return {
      reveal: false,
      spaceNameInput: "",
    };
  },
  computed: {
    processing() {
      return this.$store.state.spaces.processingStatus;
    },
    availableSpaces() {
      console.log(
        "available",
        map(this.$store.state.spaces.availableSpaces, (space) => ({
          name: space.name,
          url: space.url,
        }))
      );
      return map(this.$store.state.spaces.availableSpaces, (space) => space);
    },
  },
  methods: {
    createSpace() {
      this.$store.dispatch("spaces/createSpace", { name: this.spaceNameInput });
    },
  },
};
</script>
<style>
.canvas {
  padding: 3em;
  max-width: 1200px;
}
</style>
