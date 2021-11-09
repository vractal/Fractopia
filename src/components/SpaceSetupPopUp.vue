 
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
      <v-text-field v-model="spaceNameInput" />
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
  data() {
    return {
      spaceNameInput: "",
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
    isProcessingInitialization() {
      return (
        this.$store.state.spaces.processingStatus ===
        processingStates.creatingSpace
      );
    },
  },
};
</script>
