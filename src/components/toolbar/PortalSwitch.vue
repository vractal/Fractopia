<template>
  <div class="portal-switch d-flex flex-row align-start">
    <v-text-field
      @blur="changeSpace"
      v-model="spaceInput"
      placeholder="Space/"
      dense
      outlined
      single-line
    />
    <v-select
      @change="changePortal"
      v-model="contextInput"
      :items="availablePortals"
      placeholder="@Portal"
      dense
      outlined
      single-line
    />
    <v-btn @click="reloadPortals">
      <v-icon>mdi-refresh</v-icon>
    </v-btn>
    <v-btn small @click="createNew">
      <v-icon>mdi-add</v-icon>
    </v-btn>
    <v-sheet
      elevation="1"
      v-if="creating"
      class="pa-6 d-flex flex-column justify-start"
    >
      <v-text-field placeholder="Name" v-model="createNameInput" />
      <v-text-field placeholder="subportal" v-model="createSubportalInput" />
      <v-btn small @click="cancel"><v-icon>mdi-close</v-icon></v-btn>
      <v-btn small @click="createNew"> <v-icon>mdi-ok</v-icon></v-btn>
    </v-sheet>
    <div></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
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
    this.spaceInput = this.spaceStorage;
  },
  watch: {
    currentPortal(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.contextInput = newValue || "";
      }
    },
  },
  computed: {
    spaceStorage() {
      return this.$store.state.auth.spaceStoragePrefix;
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
    changeSpace() {
      this.$store.dispatch("auth/setSpaceStorage", this.spaceInput);
    },
    createNew() {
      if (this.creating) {
        this.$store.dispatch("portals/createPortal", {
          name: this.createNameInput,
          subPortals: [this.createSubportalInput],
          defaultSubPortal: this.createSubportalInput,
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

