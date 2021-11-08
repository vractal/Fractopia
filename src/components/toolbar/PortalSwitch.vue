<template>
  <div class="d-flex flex-row align-center">
    <v-select
      @change="changePortal"
      v-model="contextInput"
      :items="availablePortals"
      placeholder="@Portal"
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
  watch: {
    currentPortal(newValue, oldValue) {
      console.log("current", newValue, oldValue);
      if (newValue !== oldValue) {
        this.contextInput = newValue;
      }
    },
  },
  computed: {
    currentPortal() {
      return this.$store.state.portals.activePortal.url || "";
    },
    availablePortals() {
      console.log("availableP", this.$store.state.portals.availablePortals);
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
    createNew() {
      if (this.creating) {
        this.$store.dispatch("portals/createPortal", {
          name: this.createNameInput,
          subPortals: [this.createSubportalInput],
          defaultSubPortal: [this.createSubportalInput],
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

