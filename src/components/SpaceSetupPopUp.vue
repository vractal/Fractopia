<template>
  <v-row justify="center" v-if="isProcessing">
    <v-dialog v-model="dialog" persistent max-width="600">
      <v-card class="pa-4 text-center center-text">
        <v-card-title class="text-h5">
          It seems this is your first time.. So first, you need to create your
          space
        </v-card-title>

        <v-card-title class="text-h5"> </v-card-title>

        <v-card-text class="mb-0 pb-0"
          >A space is where things live. Your happy data ranch.
        </v-card-text>
        <v-card-text>
          We will also create some portals for you, through them you interact
          with data. But more on that later :)
        </v-card-text>

        <h1></h1>
        <v-text-field
          v-model="spaceNameInput"
          placeholder="The name for your space"
        />

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="white--text purple darken-1"
            rounded
            block
            @click="initializeSpace"
            :loading="isProcessingInitialization"
            >Make it!</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import processingStates from "@/utils/processingStates";

export default {
  props: {
    icon: String,
    label: String,
  },
  data() {
    return {
      spaceNameInput: "",
      dialog: true,
    };
  },
  methods: {
    initializeSpace() {
      this.$store.dispatch("spaces/createSpace", {
        name: this.spaceNameInput || "personal",
        isDefaultSpace: true,
      });
    },
  },
  computed: {
    waitingForSpaceTime() {
      return false;
    },
    isProcessing() {
      return !!this.$store.state.spaces.processingStatus;
    },
    isProcessingInitialization() {
      return (
        this.$store.state.spaces.processingStatus ===
        processingStates.creatingSpace
      );
    },
  },
};
</script>
