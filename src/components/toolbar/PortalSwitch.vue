<template>
  <div class="portal-switch d-flex flex-row align-start">
    <p class="pa-6 ml-16">{{ spaceName }}</p>

    <v-select
      @change="changePortal"
      v-model="contextInput"
      :items="availablePortals"
      placeholder="@Portal"
      dense
      outlined
      single-line
    />
    <v-btn small @click="createNew">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-btn small @click="reloadPortals">
      <v-icon>mdi-refresh</v-icon>
    </v-btn>
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

    <div></div>
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

