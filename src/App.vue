<template>
  <div id="app">
    <v-app>
      <v-main>
        <v-sheet
          elevation="0"
          v-if="returningFromAuth && loadingSilent"
          class="d-flex justify-center align-center "
          height="100%"
        >
          <v-sheet
            elevation="1"
            class="pa-6 d-flex justify-center align-center flex-column"
          >
            <v-progress-circular color="primary" :size="70" indeterminate />
            <h2>Carregando Aplicação</h2>
          </v-sheet>
        </v-sheet>

        <div v-else-if="logged">
          <tool-bar />
          <active-view />
        </div>
        <SolidLogin v-else />
      </v-main>
    </v-app>
  </div>
</template>

<script>
import SolidLogin from "@/components/SolidLogin";
import ToolBar from "@/components/toolbar/ToolBar.vue";
import ActiveView from "./components/ActiveView.vue";

export default {
  name: "App",
  components: {
    SolidLogin,
    ToolBar,
    ActiveView,
  },
  created() {
    console.log("Created", this.$route);
    if (this.returningFromAuth) {
      this.$store.dispatch("auth/silentLogin");
    }
  },
  computed: {
    logged() {
      return this.$store.state.auth.webId;
    },
    returningFromAuth() {
      return this.$route.query.code;
    },
    loadingSilent() {
      return this.$store.state.auth.processingSilent;
    },
    loading() {
      return this.$store.state.auth.processing;
    },
  },
  watch: {
    returningFromAuth(newValue, oldValue) {
      console.log("Return", newValue, oldValue);
    },
    logged(newValue, oldValue) {
      console.log("Return", newValue, oldValue);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* background-color: #3a3b3c; */
}
</style>
