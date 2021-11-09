 
 <template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600">
      <v-card class="pa-4">
        <v-card-title class="text-h5 text-center">
          {{ label }}
        </v-card-title>
        <slot />

        <v-card-actions>
          <v-btn v-if="!loading" color="gray darken-1" rounded @click="cancel"
            >Cancel</v-btn
          >
          <v-btn
            color="white--text purple darken-1"
            rounded
            @click="click"
            :loading="!!loading"
            >Ok</v-btn
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
    label: String,
    loading: String,
  },
  data() {
    return {
      spaceNameInput: "",
      dialog: true,
    };
  },
  methods: {
    click(event) {
      this.$emit("click", event);
    },
    cancel(event) {
      this.$emit("cancel", event);
    },
  },
  computed: {
    waitingForSpaceTime() {
      return (
        this.$store.state.spaces.processingStatus &&
        !this.isProcessingInitialization
      );
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
