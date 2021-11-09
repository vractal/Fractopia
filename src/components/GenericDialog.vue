 
 <template>
  <v-row justify="center">
    <v-dialog @click:outside="cancel" v-model="dialog" max-width="400">
      <v-card class="pa-4 text-center">
        <h1 center class="text-center">
          {{ label }}
        </h1>
        <slot />

        <v-card-actions>
          <!-- <v-btn
            block
            v-if="!loading"
            color="gray darken-1"
            rounded
            @click="cancel"
            >Cancel</v-btn
          > -->
          <v-btn
            block
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
