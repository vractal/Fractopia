<template>
  <div id="app">
    <v-app>
      <v-main>
        <div v-if="logged">
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
    this.$store.dispatch("auth/silentLogin");
  },
  computed: {
    logged() {
      return this.$store.state.auth.webId;
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
