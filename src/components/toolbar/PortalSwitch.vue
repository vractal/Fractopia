<template>
  <div class="portal-switch d-flex flex-row align-start">
    <v-sheet
      class="d-flex flex-row align-center justify-center pl-6 pb-8 ml-16"
    >
      <div @click="activateSpacesView">
        <v-text-field
          dense
          disabled
          single-line
          :value="spaceName"
          max-width="100"
          :messages="['Current Space', '(click to change)']"
          class="py-6 ml-16"
        >
          <template v-slot:prepend>
            <v-icon color="purple darken-2" class="mb-4" big>mdi-cube</v-icon>
          </template>
        </v-text-field>
      </div>
      <v-select
        class="mb-1"
        messages="Active Portal"
        @change="changePortal"
        v-model="contextInput"
        :items="availablePortals"
        placeholder="@Portal"
        dense
        single-line
      />

      <v-icon class="mb-4" @click="createNew" big color="purple darken-2"
        >mdi-plus</v-icon
      >
      <v-icon color="purple darken-2" class="mb-4" big @click="reloadPortals"
        >mdi-refresh</v-icon
      >
      <GenericDialog
        v-if="creating"
        @click="createNew"
        @cancel="cancel"
        label="Create Portal"
      >
        <v-text-field placeholder="Name" v-model="createNameInput" />

        <v-autocomplete
          v-model="subPortalsSelected"
          :items="subPortalOptions"
          dense
          chips
          small-chips
          label="Subportals"
          multiple
          placeholder="subportal"
        />
      </GenericDialog>
    </v-sheet>
  </div>
</template>
<script>
import GenericDialog from "../GenericDialog.vue";
export default {
  components: { GenericDialog },
  data() {
    return {
      subPortalsSelected: [],
      subPortalOptions: [
        { text: "File Manager", value: "files" },
        { text: "Notes", value: "notes" },
        { text: "Spaces", value: "spaces" },
      ],
      creating: false,
      contextInput: "",
      createNameInput: "",
      createSubportalInput: "",
    };
  },
  props: {
    icon: String,
    label: String,
  },
  created() {
    this.reloadPortals();
  },
  watch: {
    currentPortal(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.contextInput = newValue || "";
      }
    },
  },
  computed: {
    spaceName() {
      return this.$store.getters["spaces/activeSpace"]?.name;
    },
    currentPortal() {
      return this.$store.state.portals.activePortal?.url || "";
    },
    activeSubPortal() {
      return this.$store.state.portals.activeSubPortal;
    },
    availablePortals() {
      return (
        this.$store.state.portals.availablePortals?.map((portal) => ({
          text: portal.name,
          value: portal.url,
        })) || []
      );
    },
  },
  methods: {
    activateSpacesView() {
      return this.$store.dispatch(
        "portals/setActiveSubportal",
        this.activeSubPortal === "spaces" ? null : "spaces"
      );
    },
    reloadPortals() {
      this.$store.dispatch("portals/getAvailablePortals");
    },
    changePortal() {
      this.$store.dispatch("portals/activatePortal", this.contextInput);
    },
    // changeSpace() {
    //   this.$store.dispatch("auth/setSpaceStorage", this.spaceInput);
    // },
    createNew() {
      if (this.creating) {
        this.$store
          .dispatch("portals/createPortal", {
            name: this.createNameInput,
            subPortals: this.subPortalsSelected || [],
            defaultSubPortal: this.createSubportalInput,
          })
          .then(() => {
            this.cancel();
          });
      } else {
        this.creating = true;
      }
    },
    cancel() {
      this.creating = false;
      this.createNameInput = "";
      this.createSubportalInput = "";
    },
  },
};
</script>
<style>
.portal-switch {
  position: absolute;
  width: 100%;
  bottom: 0;
  margin-bottom: -20px;
  max-width: 50%;
  min-width: 300px;
}
</style>

