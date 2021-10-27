<template>
  <v-app>
    <v-main>
      <div id="app">
        <h1>Fractopia</h1>
        <SolidLogin />
        <div v-if="logged">
          <tool-bar />
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import SolidLogin from "@/components/SolidLogin";
import ToolBar from "./components/ToolBar.vue";

export default {
  name: "App",
  components: {
    SolidLogin,
    ToolBar,
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
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
