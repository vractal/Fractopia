 
 <template>
  <v-sheet
    elevation="0"
    width="100%"
    heigth="100%"
    class="d-flex justify-center align-center"
  >
    <v-sheet
      elevation="1"
      class="pa-8 text-center d-flex justify-center align-center"
    >
      <h1>Lets create your personal space</h1>
      <v-btn @click="initializeSpace" :loading="isProcessingInitialization"
        >Start</v-btn
      >
    </v-sheet>
  </v-sheet>
</template>
<script>
import processingStates from "@/utils/processingStates";

export default {
  props: {
    icon: String,
    label: String,
  },
  methods: {
    initializeSpace() {
      this.$store.dispatch("auth/initialSetup");
    },
  },
  computed: {
    isProcessingInitialization() {
      return (
        this.$store.state.auth.processingStatus ===
        processingStates.initialSetup
      );
    },
  },
};
</script>
